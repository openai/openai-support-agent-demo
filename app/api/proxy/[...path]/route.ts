import type { NextRequest } from "next/server";
import { cookies } from "next/headers";
import { NextResponse } from "next/server";

import { buildSessionCookie, sessionCookieName } from "@/lib/server/auth";

const API_PROXY_TARGET = process.env.API_PROXY_TARGET;

type ProxyMethod = "GET" | "POST" | "PUT" | "PATCH" | "DELETE" | "OPTIONS";

type ProxyContext = {
  params: Promise<{ path: string[] }>;
};

/**
 * Same-origin proxy to forward API calls while translating the HttpOnly session cookie
 * into an upstream Authorization header. This keeps browser calls on the jwpai.uk
 * origin to avoid CORS and preserves cookies even when Cloudflare or other proxies
 * rewrite headers.
 */
async function handleProxy(request: NextRequest, context: ProxyContext) {
  if (!API_PROXY_TARGET) {
    return new Response(JSON.stringify({ error: "API_PROXY_TARGET is not configured" }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }

  const params = await context.params;
  const targetBase = API_PROXY_TARGET.endsWith("/") ? API_PROXY_TARGET : `${API_PROXY_TARGET}/`;
  const path = Array.isArray(params?.path) ? params.path.join("/") : "";
  const targetUrl = new URL(path, targetBase);
  const requestUrl = new URL(request.url);
  targetUrl.search = requestUrl.search;

  const headers = new Headers(request.headers);
  headers.delete("cookie");
  headers.delete("host");

  const session = (await cookies()).get(sessionCookieName());
  if (session?.value) {
    headers.set("authorization", `Bearer ${session.value}`);
  }

  const body = request.method === "GET" || request.method === "HEAD" ? undefined : request.body;

  const upstreamResponse = await fetch(targetUrl.toString(), {
    method: request.method,
    headers,
    body,
    redirect: "manual",
  });

  const responseHeaders = new Headers(upstreamResponse.headers);
  responseHeaders.delete("set-cookie");
  responseHeaders.delete("content-length");
  responseHeaders.delete("transfer-encoding");

  const shouldInterceptLogin = /login$/i.test(targetUrl.pathname) || /auth\/login$/i.test(targetUrl.pathname);
  const setCookies: string[] = [];
  const upstreamSetCookie = upstreamResponse.headers.get("set-cookie");
  if (upstreamSetCookie) setCookies.push(upstreamSetCookie);

  if (shouldInterceptLogin) {
    const clone = upstreamResponse.clone();
    const loginPayload = (await clone.json().catch(() => null)) as
      | { tokenId?: string; csrf?: string }
      | null;
    if (loginPayload?.tokenId && loginPayload?.csrf) {
      const sessionCookie = buildSessionCookie(loginPayload.tokenId, loginPayload.csrf, { request });
      setCookies.push(sessionCookie);
    }
  }

  const response = new NextResponse(upstreamResponse.body, {
    status: upstreamResponse.status,
    headers: responseHeaders,
  });

  for (const cookie of setCookies) {
    response.headers.append("set-cookie", cookie);
  }

  return response;
}

function createHandler(method: ProxyMethod) {
  return (request: NextRequest, context: ProxyContext) => {
    if (request.method !== method) {
      return new Response("Method Not Allowed", { status: 405 });
    }
    return handleProxy(request, context);
  };
}

export const GET = createHandler("GET");
export const POST = createHandler("POST");
export const PUT = createHandler("PUT");
export const PATCH = createHandler("PATCH");
export const DELETE = createHandler("DELETE");
export const OPTIONS = createHandler("OPTIONS");

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

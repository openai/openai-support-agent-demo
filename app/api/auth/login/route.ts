import crypto from "crypto";

import prisma from "@/lib/prisma";
import {
  buildSessionCookie,
  createLoginToken,
  signVerificationToken,
  unauthorized,
} from "@/lib/server/auth";
import { rateLimit } from "@/lib/server/rateLimit";
import { comparePin } from "@/lib/vendor/bcrypt";

const TOKEN_TTL_MS = 10 * 60 * 1000;
const COOKIE_DEBUG = (process.env.AUTH_COOKIE_DEBUG ?? "").toLowerCase() === "true";
const DEFAULT_LOGIN_SAMESITE = (process.env.AUTH_COOKIE_SAMESITE ?? "Lax").toLowerCase();

function getIp(request: Request) {
  return (
    request.headers.get("x-forwarded-for") ||
    request.headers.get("cf-connecting-ip") ||
    request.headers.get("x-real-ip") ||
    "unknown"
  );
}

async function sendTelegramCode(chatId: string, code: string) {
  const botToken = process.env.TELEGRAM_BOT_TOKEN;
  if (!botToken) return { ok: false, reason: "Missing bot token" } as const;
  const baseUrl = process.env.TELEGRAM_BOT_BASE_URL ?? "https://api.telegram.org";
  const url = `${baseUrl}/bot${botToken}/sendMessage`;
  const body = {
    chat_id: chatId,
    text: `Your login code: ${code}\nThis code expires in 10 minutes.`,
  };
  try {
    const res = await fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    });
    if (!res.ok) {
      return { ok: false, reason: `Telegram error ${res.status}` } as const;
    }
    return { ok: true } as const;
  } catch (error) {
    console.error("Failed to send Telegram code", error);
    return { ok: false, reason: "Network error" } as const;
  }
}

export async function GET(request: Request) {
  if (!rateLimit(`login-status:${getIp(request)}`)) {
    return new Response(JSON.stringify({ error: "Too many attempts" }), {
      status: 429,
      headers: { "Content-Type": "application/json" },
    });
  }
  return new Response(JSON.stringify({ ok: true }), { headers: { "Content-Type": "application/json" } });
}

export async function POST(request: Request) {
  const ip = getIp(request);
  if (!rateLimit(`login:${ip}`)) {
    return new Response(JSON.stringify({ error: "Too many attempts" }), {
      status: 429,
      headers: { "Content-Type": "application/json" },
    });
  }

  const payload = (await request.json().catch(() => null)) as {
    userId?: string;
    pin?: string;
  } | null;

  if (!payload?.userId || !payload.pin) {
    return new Response(JSON.stringify({ error: "userId and pin are required" }), {
      status: 400,
      headers: { "Content-Type": "application/json" },
    });
  }

  const agent = await prisma.agentAccount.findUnique({ where: { userId: payload.userId } });
  if (!agent) {
    return unauthorized("Invalid credentials");
  }

  const pinValid = comparePin(payload.pin, agent.hashedPin);
  await prisma.loginAudit.create({
    data: {
      agentId: agent.userId,
      status: pinValid ? "success" : "failure",
      ip,
      userAgent: request.headers.get("user-agent") ?? undefined,
    },
  });

  if (!pinValid) {
    return unauthorized("Invalid credentials");
  }

  const { token, hash } = createLoginToken();
  const expiresAt = new Date(Date.now() + TOKEN_TTL_MS);
  const csrf = crypto.randomBytes(16).toString("hex");
  const loginToken = await prisma.loginToken.create({
    data: {
      agentId: agent.userId,
      tokenHash: hash,
      expiresAt,
    },
  });

  await prisma.loginAudit.create({
    data: {
      agentId: agent.userId,
      status: "token_sent",
      ip,
      userAgent: request.headers.get("user-agent") ?? undefined,
      note: `expires_at=${expiresAt.toISOString()}`,
    },
  });

  const signedToken = signVerificationToken(loginToken.id, token);
  const telegramResult = agent.telegramChatId
    ? await sendTelegramCode(agent.telegramChatId, `/start ${signedToken}`)
    : { ok: false, reason: "No chat id" as const };
  const fetchSite = request.headers.get("sec-fetch-site")?.toLowerCase();
  const normalizedDefaultSameSite: "Lax" | "Strict" | "None" =
    DEFAULT_LOGIN_SAMESITE === "none"
      ? "None"
      : DEFAULT_LOGIN_SAMESITE === "strict"
        ? "Strict"
        : "Lax";
  const sameSite: "Lax" | "Strict" | "None" =
    fetchSite === "cross-site" ? "None" : normalizedDefaultSameSite;

  const cookie = buildSessionCookie(loginToken.id, csrf, {
    request,
    sameSite,
  });

  if (COOKIE_DEBUG) {
    const host = request.headers.get("host");
    const forwardedHost = request.headers.get("x-forwarded-host");
    const forwardedProto = request.headers.get("x-forwarded-proto");
    console.log(
      JSON.stringify(
        {
          label: "login.set-cookie",
          host,
          forwardedHost,
          forwardedProto,
          sameSite,
          setCookie: cookie,
        },
        null,
        2
      )
    );
  }

  return new Response(
    JSON.stringify({
      pending: true,
      expiresAt: expiresAt.toISOString(),
      chatConfigured: !!agent.telegramChatId,
      telegramDelivery: telegramResult,
      roles: agent.roles,
    }),
    {
      status: telegramResult.ok ? 200 : 202,
      headers: {
        "Content-Type": "application/json",
        ...(cookie ? { "Set-Cookie": cookie } : {}),
      },
    }
  );
}

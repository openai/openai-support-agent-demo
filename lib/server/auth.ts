import crypto from "crypto";
import prisma from "../prisma";
import { AgentRole } from "../generated/prisma";
import { getRequestContext, isLocalHostName } from "./requestContext";

const SESSION_COOKIE_NAME = "agent_session";
const SESSION_SECRET = process.env.AUTH_SESSION_SECRET ?? process.env.SCRAPE_JOB_ADMIN_TOKEN ?? "change-me";

const VERIFICATION_SECRET =
  process.env.LOGIN_TOKEN_SECRET ?? process.env.AUTH_SESSION_SECRET ?? process.env.SCRAPE_JOB_ADMIN_TOKEN ?? "login-secret";

const DEFAULT_SESSION_LIFETIME_MS = 12 * 60 * 60 * 1000;

export const SESSION_LIFETIME_MS = (() => {
  const raw = process.env.SESSION_LIFETIME_MS;
  if (!raw) return DEFAULT_SESSION_LIFETIME_MS;
  const parsed = Number(raw);
  return Number.isFinite(parsed) && parsed > 0 ? parsed : DEFAULT_SESSION_LIFETIME_MS;
})();

export type SessionCookiePayload = {
  tokenId: string;
  csrf: string;
};

export type SessionContext = {
  tokenId: string;
  csrf: string;
  verified: boolean;
  expiresAt: Date;
  agent: {
    userId: string;
    roles: AgentRole[];
    telegramChatId: string | null;
  };
};

function parseCookies(header: string | null) {
  if (!header) return {} as Record<string, string>;
  return header.split(";").reduce((acc, entry) => {
    const [rawKey, ...rawValue] = entry.trim().split("=");
    if (!rawKey) return acc;
    acc[decodeURIComponent(rawKey)] = decodeURIComponent(rawValue.join("="));
    return acc;
  }, {} as Record<string, string>);
}

function signPayload(payload: SessionCookiePayload) {
  const serialized = Buffer.from(JSON.stringify(payload)).toString("base64url");
  const hmac = crypto.createHmac("sha256", SESSION_SECRET);
  hmac.update(serialized);
  const signature = hmac.digest("hex");
  return `${serialized}.${signature}`;
}

function verifyPayload(raw: string | undefined): SessionCookiePayload | null {
  if (!raw) return null;
  const [serialized, signature] = raw.split(".");
  if (!serialized || !signature) return null;
  const hmac = crypto.createHmac("sha256", SESSION_SECRET);
  hmac.update(serialized);
  const expected = hmac.digest("hex");
  const expectedBuffer = Buffer.from(expected);
  const providedBuffer = Buffer.from(signature);
  if (
    expectedBuffer.length !== providedBuffer.length ||
    !crypto.timingSafeEqual(expectedBuffer, providedBuffer)
  ) {
    return null;
  }

  try {
    const payload = JSON.parse(Buffer.from(serialized, "base64url").toString("utf8"));
    if (payload && typeof payload.tokenId === "string" && typeof payload.csrf === "string") {
      return payload as SessionCookiePayload;
    }
  } catch (error) {
    console.warn("Failed to parse session payload", error);
  }
  return null;
}

export type BuildSessionCookieOptions = {
  request?: Request;
  maxAgeSeconds?: number;
  sameSite?: "Strict" | "Lax" | "None";
  domain?: string;
};

function resolveSessionCookieSettings(options: BuildSessionCookieOptions) {
  const context = getRequestContext(options.request);
  const sameSite = options.sameSite ?? "Strict";
  const publicHost = options.domain ?? (!context.isLocalhost ? context.hostname : null);

  // Prefer the resolved protocol, but guarantee Secure when:
  // - SameSite=None (required by browsers), or
  // - The resolved host is non-local, to avoid dropping Secure in HTTPS deployments where
  //   proxies omit x-forwarded-proto.
  let secure = context.protocol === "https";
  const nonLocalHost = publicHost ? !isLocalHostName(publicHost) : false;
  if (!secure && (sameSite === "None" || nonLocalHost)) {
    secure = true;
  }

  // Only allow SameSite=None when secure and tied to a public host to avoid emitting
  // insecure cross-site cookies when proxies withhold protocol hints.
  const finalSameSite = sameSite === "None" && (!secure || !publicHost) ? "Lax" : sameSite;
  return { sameSite: finalSameSite, secure, publicHost } as const;
}

export function buildSessionCookie(tokenId: string, csrf: string, options: BuildSessionCookieOptions = {}) {
  const signed = signPayload({ tokenId, csrf });
  const { sameSite, secure, publicHost } = resolveSessionCookieSettings(options);
  const maxAgeSeconds = options.maxAgeSeconds ?? SESSION_LIFETIME_MS / 1000;

  return [
    `${SESSION_COOKIE_NAME}=${signed}`,
    "Path=/",
    "HttpOnly",
    `SameSite=${sameSite}`,
    secure ? "Secure" : null,
    publicHost ? `Domain=${publicHost}` : null,
    `Max-Age=${maxAgeSeconds}`,
  ]
    .filter(Boolean)
    .join("; ");
}

export function buildExpiredSessionCookie(options: BuildSessionCookieOptions = {}) {
  const { sameSite, secure, publicHost } = resolveSessionCookieSettings(options);
  return [
    `${SESSION_COOKIE_NAME}=`,
    "Path=/",
    "HttpOnly",
    `SameSite=${sameSite}`,
    secure ? "Secure" : null,
    publicHost ? `Domain=${publicHost}` : null,
    "Max-Age=0",
  ]
    .filter(Boolean)
    .join("; ");
}

export async function getSession(request: Request): Promise<SessionContext | null> {
  const cookies = parseCookies(request.headers.get("cookie"));
  const payload = verifyPayload(cookies[SESSION_COOKIE_NAME]);
  if (!payload) return null;

  const loginToken = await prisma.loginToken.findUnique({
    where: { id: payload.tokenId },
    include: { agent: true },
  });
  if (!loginToken || !loginToken.agent) return null;
  const expired = loginToken.expiresAt.getTime() <= Date.now();
  return {
    tokenId: payload.tokenId,
    csrf: payload.csrf,
    expiresAt: loginToken.expiresAt,
    verified: !!loginToken.consumedAt && !expired,
    agent: {
      userId: loginToken.agent.userId,
      roles: loginToken.agent.roles,
      telegramChatId: loginToken.agent.telegramChatId ?? null,
    },
  };
}

export function unauthorized(message = "Unauthorized", status = 401) {
  return new Response(JSON.stringify({ error: message }), {
    status,
    headers: { "Content-Type": "application/json" },
  });
}

export async function requireSession(
  request: Request,
  options: { role?: AgentRole; csrfProtected?: boolean; requireVerified?: boolean } = {}
): Promise<{ session: SessionContext } | { response: Response }> {
  const session = await getSession(request);
  if (!session) {
    return { response: unauthorized() };
  }

  if (options.requireVerified !== false && !session.verified) {
    return { response: unauthorized("Verification pending", 401) };
  }

  if (options.role && !session.agent.roles.includes(options.role)) {
    return { response: unauthorized("Forbidden", 403) };
  }

  if (options.csrfProtected) {
    const headerToken = request.headers.get("x-csrf-token");
    if (!headerToken || headerToken !== session.csrf) {
      return { response: unauthorized("Invalid CSRF token", 403) };
    }
  }

  return { session };
}

export function createLoginToken() {
  const token = crypto.randomBytes(20).toString("hex");
  const hash = crypto.createHash("sha256").update(token).digest("hex");
  return { token, hash } as const;
}

export function sessionCookieName() {
  return SESSION_COOKIE_NAME;
}

export function signVerificationToken(tokenId: string, token: string) {
  const base = `${tokenId}:${token}`;
  const hmac = crypto.createHmac("sha256", VERIFICATION_SECRET);
  hmac.update(base);
  const signature = hmac.digest("hex");
  return `${tokenId}.${token}.${signature}`;
}

export function verifySignedVerificationToken(input: string | null | undefined) {
  if (!input) return null;
  const [tokenId, token, signature] = input.split(".");
  if (!tokenId || !token || !signature) return null;
  const base = `${tokenId}:${token}`;
  const hmac = crypto.createHmac("sha256", VERIFICATION_SECRET);
  hmac.update(base);
  const expected = hmac.digest("hex");
  const expectedBuffer = Buffer.from(expected);
  const providedBuffer = Buffer.from(signature);
  if (
    expectedBuffer.length !== providedBuffer.length ||
    !crypto.timingSafeEqual(expectedBuffer, providedBuffer)
  ) {
    return null;
  }
  return { tokenId, token } as const;
}

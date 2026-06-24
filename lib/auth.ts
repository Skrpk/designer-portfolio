export const SESSION_COOKIE = "portfolio_auth";
export const SESSION_MAX_AGE = 60 * 60; // 1 hour in seconds

function getSecret(): string {
  const secret = process.env.AUTH_SECRET;
  if (!secret) {
    throw new Error("AUTH_SECRET is not set");
  }
  return secret;
}

function toHex(buffer: ArrayBuffer): string {
  return Array.from(new Uint8Array(buffer))
    .map((b) => b.toString(16).padStart(2, "0"))
    .join("");
}

async function hmac(message: string): Promise<string> {
  const enc = new TextEncoder();
  const key = await crypto.subtle.importKey(
    "raw",
    enc.encode(getSecret()),
    { name: "HMAC", hash: "SHA-256" },
    false,
    ["sign"]
  );
  const signature = await crypto.subtle.sign("HMAC", key, enc.encode(message));
  return toHex(signature);
}

function timingSafeEqual(a: string, b: string): boolean {
  if (a.length !== b.length) return false;
  let result = 0;
  for (let i = 0; i < a.length; i++) {
    result |= a.charCodeAt(i) ^ b.charCodeAt(i);
  }
  return result === 0;
}

/**
 * Creates a signed cookie value of the form `<expiresAt>.<hmac>`.
 */
export async function createSessionValue(): Promise<string> {
  const expiresAt = Date.now() + SESSION_MAX_AGE * 1000;
  const signature = await hmac(String(expiresAt));
  return `${expiresAt}.${signature}`;
}

/**
 * Validates a signed cookie value and ensures it has not expired.
 */
export async function verifySessionValue(
  value: string | undefined | null
): Promise<boolean> {
  if (!value) return false;
  const [expiresRaw, signature] = value.split(".");
  if (!expiresRaw || !signature) return false;

  const expectedSignature = await hmac(expiresRaw);
  if (!timingSafeEqual(signature, expectedSignature)) return false;

  const expiresAt = Number(expiresRaw);
  if (!Number.isFinite(expiresAt) || Date.now() > expiresAt) return false;

  return true;
}

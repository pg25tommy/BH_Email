import { SignJWT, jwtVerify } from 'jose';
import { timingSafeEqual } from 'crypto';

const getSecret = () => new TextEncoder().encode(process.env.JWT_SECRET);

export async function verifyPassword(password: string): Promise<boolean> {
  const stored = process.env.ADMIN_PASSWORD;
  if (!stored) return false;
  if (password.length !== stored.length) return false;
  return timingSafeEqual(Buffer.from(password), Buffer.from(stored));
}

export async function createSession(): Promise<string> {
  return new SignJWT({ role: 'admin' })
    .setProtectedHeader({ alg: 'HS256' })
    .setIssuedAt()
    .setExpirationTime('24h')
    .sign(getSecret());
}

export async function verifySession(token: string): Promise<boolean> {
  try {
    await jwtVerify(token, getSecret());
    return true;
  } catch {
    return false;
  }
}

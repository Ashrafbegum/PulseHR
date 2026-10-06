import jwt from "jsonwebtoken";
import { randomUUID } from "node:crypto";

const ACCESS_TOKEN_TTL = "15m";
const REFRESH_TOKEN_TTL = "7d";
const revokedTokens = new Map();

const secretFor = (kind) => {
  const secret = process.env[kind === "refresh" ? "JWT_REFRESH_SECRET" : "JWT_SECRET"];
  if (!secret) throw new Error(`${kind === "refresh" ? "JWT_REFRESH_SECRET" : "JWT_SECRET"} is required`);
  return secret;
};

const generate = (user, kind, expiresIn) => jwt.sign(
  { sub: String(user._id ?? user.id), role: user.role, type: kind },
  secretFor(kind),
  { expiresIn, jwtid: randomUUID() },
);

export const generateAccessToken = (user) => generate(user, "access", ACCESS_TOKEN_TTL);
export const generateRefreshToken = (user) => generate(user, "refresh", REFRESH_TOKEN_TTL);

export const verifyToken = (token, kind = "access") => {
  const payload = jwt.verify(token, secretFor(kind));
  if (payload.type !== kind) {
    const error = new Error("Invalid token type");
    error.name = "JsonWebTokenError";
    throw error;
  }
  if (revokedTokens.has(payload.jti)) {
    const error = new Error("Token has been revoked");
    error.name = "JsonWebTokenError";
    throw error;
  }
  return payload;
};

// Process-local revocation is a foundation only; use a shared store for multi-instance deployments.
export const revokeToken = (token, kind = "refresh") => {
  const payload = jwt.verify(token, secretFor(kind));
  revokedTokens.set(payload.jti, payload.exp * 1000);
  return true;
};

export const TOKEN_COOKIE_OPTIONS = Object.freeze({
  httpOnly: true,
  secure: process.env.NODE_ENV === "production",
  sameSite: "strict",
  path: "/api/v1/auth",
});

export const TOKEN_TTL = Object.freeze({ access: ACCESS_TOKEN_TTL, refresh: REFRESH_TOKEN_TTL });

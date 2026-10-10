import crypto from "node:crypto";
import jwt from "jsonwebtoken";
import asyncHandler from "../middleware/asyncHandler.js";
import User from "../models/User.js";
import RefreshToken from "../models/RefreshToken.js";
import { sendResetPasswordEmail, sendVerificationEmail } from "../services/emailService.js";
import {
  generateAccessToken,
  generateRefreshToken,
  revokeToken,
  TOKEN_COOKIE_OPTIONS,
  verifyToken as verifyJwt,
} from "../services/tokenService.js";
import logger from "../utils/logger.js";
import { Joi } from "../utils/validators.js";

// tokenService.js requires JWT_REFRESH_SECRET. Single-secret setups fall back to JWT_SECRET.
if (!process.env.JWT_REFRESH_SECRET && process.env.JWT_SECRET) {
  process.env.JWT_REFRESH_SECRET = process.env.JWT_SECRET;
}

const ACCESS_COOKIE_MAX_AGE = 15 * 60 * 1000;
const REFRESH_COOKIE_MAX_AGE = 7 * 24 * 60 * 60 * 1000;
const RESET_TOKEN_TTL_MS = 60 * 60 * 1000;

const isProduction = () => process.env.NODE_ENV === "production";
const frontendBaseUrl = () => (process.env.FRONTEND_URL || "http://localhost:5173").replace(/\/+$/, "");

function httpError(statusCode, code, message) {
  const error = new Error(message);
  error.statusCode = statusCode;
  error.code = code;
  error.isOperational = true;
  return error;
}

function cookieBaseOptions() {
  const { maxAge: _maxAge, ...rest } = TOKEN_COOKIE_OPTIONS;
  return rest;
}

function setAuthCookies(res, { accessToken, refreshToken }) {
  res.cookie("accessToken", accessToken, { ...TOKEN_COOKIE_OPTIONS, maxAge: ACCESS_COOKIE_MAX_AGE });
  res.cookie("refreshToken", refreshToken, { ...TOKEN_COOKIE_OPTIONS, maxAge: REFRESH_COOKIE_MAX_AGE });
}

function clearAuthCookies(res) {
  res.clearCookie("accessToken", cookieBaseOptions());
  res.clearCookie("refreshToken", cookieBaseOptions());
}

/** Shape a user for API responses; adds `name` for frontend display. */
function presentUser(user) {
  const plain = typeof user.toJSON === "function" ? user.toJSON() : { ...user };
  const name = user.fullName || plain.fullName
    || [plain.firstName, plain.lastName].filter(Boolean).join(" ");
  return { ...plain, name };
}

function resolveName(body) {
  let firstName = body.firstName?.trim();
  let lastName = body.lastName?.trim();
  if ((!firstName || !lastName) && typeof body.name === "string") {
    const parts = body.name.trim().split(/\s+/).filter(Boolean);
    firstName ||= parts[0] || "";
    lastName ||= parts.slice(1).join(" ") || "";
  }
  if (!firstName) throw httpError(400, "VALIDATION_ERROR", "First name is required");
  if (!lastName) lastName = firstName;
  return { firstName, lastName };
}

function validateBody(schema, body) {
  const { error, value } = schema.validate(body);
  if (error) throw error;
  return value;
}

async function issueSession(user, ipAddress) {
  const accessToken = generateAccessToken(user);
  const refreshToken = generateRefreshToken(user);
  const decoded = jwt.decode(refreshToken);
  await RefreshToken.create({
    userId: user._id,
    token: refreshToken,
    expiresAt: decoded?.exp ? new Date(decoded.exp * 1000) : new Date(Date.now() + REFRESH_COOKIE_MAX_AGE),
    ipAddress: ipAddress || "",
  });
  return { accessToken, refreshToken };
}

const signupSchema = Joi.object({
  email: Joi.string().email().lowercase().trim().required(),
  password: Joi.string().min(8).required(),
  name: Joi.string().trim().max(120),
  firstName: Joi.string().trim().max(60),
  lastName: Joi.string().trim().max(60),
  phone: Joi.string().trim().max(30).allow(""),
}).or("name", "firstName");

const loginSchema = Joi.object({
  email: Joi.string().email().lowercase().trim().required(),
  password: Joi.string().required(),
});

const forgotPasswordSchema = Joi.object({
  email: Joi.string().email().lowercase().trim().required(),
});

const resetPasswordSchema = Joi.object({
  token: Joi.string().trim().required(),
  password: Joi.string().min(8).required(),
});

export const signup = asyncHandler(async (req, res) => {
  const body = validateBody(signupSchema, req.body);
  const { firstName, lastName } = resolveName(body);

  const existing = await User.findOne({ email: body.email });
  if (existing) throw httpError(409, "EMAIL_TAKEN", "An account with this email already exists");

  // Role/status are server-assigned; never trust them from a signup payload.
  const user = await User.create({
    email: body.email,
    password: body.password,
    firstName,
    lastName,
    phone: body.phone || "",
    role: "employee",
    status: "active",
    lastLogin: new Date(),
  });

  const { accessToken, refreshToken } = await issueSession(user, req.ip);
  setAuthCookies(res, { accessToken, refreshToken });

  const verificationToken = jwt.sign(
    { sub: String(user._id), type: "verify" },
    process.env.JWT_SECRET,
    { expiresIn: "24h", jwtid: crypto.randomUUID() },
  );
  const verificationUrl = `${frontendBaseUrl()}/verify-email?token=${verificationToken}`;
  let emailSent = true;
  try {
    await sendVerificationEmail({ to: user.email, name: user.fullName, verificationUrl });
  } catch (error) {
    emailSent = false;
    logger.warn("Verification email not sent", { to: user.email, verificationUrl, error: error.message });
  }

  return res.status(201).json({
    success: true,
    data: {
      user: presentUser(user),
      accessToken,
      emailSent,
      ...(isProduction() ? {} : { verificationToken, verificationUrl }),
    },
  });
});

export const login = asyncHandler(async (req, res) => {
  const body = validateBody(loginSchema, req.body);

  const user = await User.findOne({ email: body.email }).select("+password");
  const passwordOk = user ? await user.comparePassword(body.password) : false;
  if (!user || !passwordOk) {
    throw httpError(401, "INVALID_CREDENTIALS", "Invalid email or password");
  }
  if (user.status !== "active") {
    throw httpError(403, "ACCOUNT_DISABLED", "This account is not active. Contact your administrator.");
  }

  user.lastLogin = new Date();
  await user.save();

  const { accessToken, refreshToken } = await issueSession(user, req.ip);
  setAuthCookies(res, { accessToken, refreshToken });

  return res.status(200).json({
    success: true,
    data: { user: presentUser(user), accessToken },
  });
});

export const refresh = asyncHandler(async (req, res) => {
  const token = req.cookies?.refreshToken;
  if (!token) throw httpError(401, "UNAUTHENTICATED", "Authentication is required");

  let payload;
  try {
    payload = verifyJwt(token, "refresh");
  } catch {
    clearAuthCookies(res);
    throw httpError(401, "UNAUTHENTICATED", "Session has expired. Please sign in again.");
  }

  const stored = await RefreshToken.findOne({ token, isRevoked: false });
  if (!stored || stored.expiresAt.getTime() <= Date.now()) {
    clearAuthCookies(res);
    throw httpError(401, "UNAUTHENTICATED", "Session has expired. Please sign in again.");
  }

  const user = await User.findById(payload.sub);
  if (!user) {
    clearAuthCookies(res);
    throw httpError(401, "UNAUTHENTICATED", "Account no longer exists");
  }
  if (user.status !== "active") {
    clearAuthCookies(res);
    throw httpError(403, "ACCOUNT_DISABLED", "This account is not active. Contact your administrator.");
  }

  // Rotate: revoke the used token and issue a fresh pair.
  stored.isRevoked = true;
  await stored.save();
  try {
    revokeToken(token, "refresh");
  } catch {
    // In-memory revocation is best-effort; the database record is authoritative.
  }

  const session = await issueSession(user, req.ip);
  setAuthCookies(res, session);

  return res.status(200).json({
    success: true,
    data: { user: presentUser(user), accessToken: session.accessToken },
  });
});

export const logout = asyncHandler(async (req, res) => {
  const token = req.cookies?.refreshToken;
  if (token) {
    await RefreshToken.updateOne({ token }, { $set: { isRevoked: true } });
    try {
      revokeToken(token, "refresh");
    } catch {
      // Best-effort only.
    }
  }
  clearAuthCookies(res);
  return res.status(200).json({ success: true, data: { message: "Signed out successfully" } });
});

export const forgotPassword = asyncHandler(async (req, res) => {
  const body = validateBody(forgotPasswordSchema, req.body);

  // Always respond generically so attackers cannot enumerate registered emails.
  const generic = { message: "If an account matches that email, reset instructions have been sent." };
  const user = await User.findOne({ email: body.email });
  if (!user) return res.status(200).json({ success: true, data: generic });

  const rawToken = crypto.randomBytes(32).toString("hex");
  user.resetPasswordToken = crypto.createHash("sha256").update(rawToken).digest("hex");
  user.resetPasswordExpires = new Date(Date.now() + RESET_TOKEN_TTL_MS);
  await user.save();

  const resetUrl = `${frontendBaseUrl()}/reset-password/${rawToken}`;
  let emailSent = true;
  try {
    await sendResetPasswordEmail({ to: user.email, name: user.fullName, resetUrl });
  } catch (error) {
    emailSent = false;
    logger.warn("Reset-password email not sent", { to: user.email, resetUrl, error: error.message });
  }

  return res.status(200).json({
    success: true,
    data: {
      ...generic,
      ...(isProduction() ? {} : { resetToken: rawToken, resetUrl, emailSent }),
    },
  });
});

export const resetPassword = asyncHandler(async (req, res) => {
  const body = validateBody(resetPasswordSchema, req.body);
  const tokenHash = crypto.createHash("sha256").update(body.token).digest("hex");

  const user = await User.findOne({
    resetPasswordToken: tokenHash,
    resetPasswordExpires: { $gt: new Date() },
  }).select("+resetPasswordToken +resetPasswordExpires");
  if (!user) throw httpError(400, "INVALID_TOKEN", "Reset link is invalid or has expired");

  user.password = body.password;
  user.resetPasswordToken = undefined;
  user.resetPasswordExpires = undefined;
  user.passwordChangedAt = new Date();
  await user.save();

  // Invalidate all sessions so the changed password takes effect everywhere.
  await RefreshToken.updateMany(
    { userId: user._id, isRevoked: false },
    { $set: { isRevoked: true } },
  );
  clearAuthCookies(res);

  return res.status(200).json({
    success: true,
    data: { message: "Password updated. Sign in with your new password." },
  });
});

export const verifyEmail = asyncHandler(async (req, res) => {
  const token = req.body?.token || req.query?.token;
  if (!token) throw httpError(400, "VALIDATION_ERROR", "Verification token is required");

  let payload;
  try {
    payload = jwt.verify(token, process.env.JWT_SECRET);
  } catch {
    throw httpError(400, "INVALID_TOKEN", "Verification link is invalid or has expired");
  }
  if (payload.type !== "verify") throw httpError(400, "INVALID_TOKEN", "Verification link is invalid");

  const user = await User.findById(payload.sub);
  if (!user) throw httpError(404, "USER_NOT_FOUND", "Account not found");

  // Persists via the `isEmailVerified` path on the User schema.
  if (user.schema.path("isEmailVerified")) {
    user.set("isEmailVerified", true);
    await user.save();
  }

  return res.status(200).json({
    success: true,
    data: { user: presentUser(user), message: "Email verified successfully" },
  });
});

export const getCurrentUser = asyncHandler(async (req, res) => {
  const user = await User.findById(req.auth?.sub);
  if (!user) throw httpError(404, "USER_NOT_FOUND", "Account not found");
  return res.status(200).json({ success: true, data: { user: presentUser(user) } });
});

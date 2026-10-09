import rateLimit from "express-rate-limit";

const rateLimitResponse = {
  success: false,
  error: {
    code: "RATE_LIMITED",
    message: "Too many requests. Please try again later.",
  },
};

const createAuthRateLimiter = (windowMs, limit) => rateLimit({
  windowMs,
  limit,
  standardHeaders: true,
  legacyHeaders: false,
  message: rateLimitResponse,
});

export const loginRateLimiter = createAuthRateLimiter(15 * 60 * 1000, 10);
export const signupRateLimiter = createAuthRateLimiter(15 * 60 * 1000, 5);
export const passwordRecoveryRateLimiter = createAuthRateLimiter(60 * 60 * 1000, 5);

import { Router } from "express";
import {
  loginRateLimiter,
  passwordRecoveryRateLimiter,
  signupRateLimiter,
} from "../middleware/authRateLimiters.js";
import * as authController from "../controllers/authController.js";

const authRouter = Router();

authRouter.post("/signup", signupRateLimiter, authController.signup);
authRouter.post("/login", loginRateLimiter, authController.login);
authRouter.post("/refresh", authController.refresh);
authRouter.post("/logout", authController.logout);
authRouter.post("/forgot-password", passwordRecoveryRateLimiter, authController.forgotPassword);
authRouter.post("/reset-password", passwordRecoveryRateLimiter, authController.resetPassword);

export default authRouter;

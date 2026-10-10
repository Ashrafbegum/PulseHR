import { Router } from "express";
import {
  loginRateLimiter,
  passwordRecoveryRateLimiter,
  signupRateLimiter,
} from "../middleware/authRateLimiters.js";
import * as authController from "../controllers/authController.js";
import verifyToken from "../middleware/verifyToken.js";

const authRouter = Router();

authRouter.post("/signup", signupRateLimiter, authController.signup);
authRouter.post("/login", loginRateLimiter, authController.login);
authRouter.post("/refresh", authController.refresh);
authRouter.post("/logout", authController.logout);
authRouter.post("/forgot-password", passwordRecoveryRateLimiter, authController.forgotPassword);
authRouter.post("/reset-password", passwordRecoveryRateLimiter, authController.resetPassword);
authRouter.post("/verify-email", authController.verifyEmail);
authRouter.get("/verify-email", authController.verifyEmail);
authRouter.get("/me", verifyToken, authController.getCurrentUser);

export default authRouter;

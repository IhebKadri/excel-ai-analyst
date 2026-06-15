import { Router } from "express";
import { AuthController } from "../controllers/AuthController";
import { authMiddleware } from "../middlewares/auth.middleware";
import { createRateLimiter } from "../middlewares/rateLimit.middleware";
const authLimiter = createRateLimiter({
  windowMinutes: 15,
  max: 10,
  message: "Too many attempts, please try again in 15 minutes",
});

export function createAuthRouter(controller: AuthController): Router {
  const router = Router();
  router.post("/register", authLimiter, controller.register);
  router.post("/login", authLimiter, controller.login);
  router.post("/logout", authMiddleware, controller.logout);
  router.get("/me", authMiddleware, controller.me);
  return router;
}

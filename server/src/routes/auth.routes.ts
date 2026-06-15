import { Router } from 'express';
import { AuthController } from '../controllers/AuthController';
import { authMiddleware } from '../middlewares/auth.middleware';
import { authRateLimiter } from '../middlewares/rateLimit.middleware';

export function createAuthRouter(controller: AuthController): Router {
  const router = Router();
  router.post('/register', authRateLimiter, controller.register);
  router.post('/login', authRateLimiter, controller.login);
  router.post('/logout', authMiddleware, controller.logout);
  router.get('/me', authMiddleware, controller.me);
  return router;
}
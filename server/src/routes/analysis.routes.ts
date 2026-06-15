import { Router } from "express";
import { AnalysisController } from "../controllers/AnalysisController";
import { authMiddleware } from "../middlewares/auth.middleware";
import { createRateLimiter } from '../middlewares/rateLimit.middleware';

const analysisLimiter = createRateLimiter({ windowMinutes: 1, max: 20 });

export function createAnalysisRouter(controller: AnalysisController): Router {
  const router = Router();
  router.use(authMiddleware);
  router.post("/ask", analysisLimiter, controller.ask);
  router.get("/report/:fileId", analysisLimiter, controller.report);
  return router;
}

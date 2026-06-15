import { Router } from "express";
import { AnalysisController } from "../controllers/AnalysisController";
import { authMiddleware } from "../middlewares/auth.middleware";
import { analysisRateLimiter } from "../middlewares/rateLimit.middleware";

export function createAnalysisRouter(controller: AnalysisController): Router {
  const router = Router();
  router.use(authMiddleware);
  router.post("/ask", analysisRateLimiter, controller.ask);
  router.get("/report/:fileId", analysisRateLimiter, controller.report);
  return router;
}

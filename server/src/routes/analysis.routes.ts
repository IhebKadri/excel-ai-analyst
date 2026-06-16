import { Router } from "express";
import { AnalysisController } from "../controllers/AnalysisController";
import { authMiddleware } from "../middlewares/auth.middleware";
import { createRateLimiter } from '../middlewares/rateLimit.middleware';

const analysisLimiter = createRateLimiter({ windowMinutes: 1, max: 5 });
const analysisDailyLimiter = createRateLimiter({
  windowMinutes: 60 * 24,
  max: 100,
  message: 'Daily request limit reached, please try again tomorrow',
});

export function createAnalysisRouter(controller: AnalysisController): Router {
  const router = Router();
  router.use(authMiddleware);
  router.post('/ask', analysisLimiter, analysisDailyLimiter, controller.ask);
  router.get('/report/:fileId', analysisLimiter, analysisDailyLimiter, controller.report);
  return router;
}

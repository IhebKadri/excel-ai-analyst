import { Router } from 'express';
import { AnalysisController } from '../controllers/AnalysisController';
import { authMiddleware } from '../middlewares/auth.middleware';

export function createAnalysisRouter(controller: AnalysisController): Router {
  const router = Router();
  router.use(authMiddleware);
  router.post('/ask', controller.ask);
  router.get('/report/:fileId', controller.report);
  return router;
}
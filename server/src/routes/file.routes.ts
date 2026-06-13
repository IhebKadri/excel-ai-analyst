import { Router } from 'express';
import { FileController } from '../controllers/FileController';
import { authMiddleware } from '../middlewares/auth.middleware';
import { uploadMiddleware } from '../middlewares/upload.middleware';

export function createFileRouter(controller: FileController): Router {
  const router = Router();
  router.use(authMiddleware);
  router.post('/', uploadMiddleware.single('file'), controller.upload);
  router.get('/', controller.list);
  router.delete('/:id', controller.remove);
  return router;
}
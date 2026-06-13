import { Request, Response, NextFunction } from 'express';
import { FileService } from '../services/FileService';
import { ApiError } from '../utils/ApiError';

export class FileController {
  constructor(private readonly fileService: FileService) {}

  upload = async (req: Request, res: Response, next: NextFunction) => {
    try {
      if (!req.file) throw ApiError.badRequest('No file uploaded');
      if (!req.user) throw ApiError.unauthorized();

      const file = await this.fileService.upload(req.user.userId, req.file);
      res.status(201).json({ success: true, data: { file } });
    } catch (err) { next(err); }
  };

  list = async (req: Request, res: Response, next: NextFunction) => {
    try {
      if (!req.user) throw ApiError.unauthorized();
      const files = await this.fileService.getUserFiles(req.user.userId);
      res.json({ success: true, data: { files } });
    } catch (err) { next(err); }
  };

  remove = async (req: Request, res: Response, next: NextFunction) => {
    try {
      if (!req.user) throw ApiError.unauthorized();
      const id = req.params['id'] as string;
      await this.fileService.deleteFile(id, req.user.userId);
      res.json({ success: true });
    } catch (err) { next(err); }
  };
}
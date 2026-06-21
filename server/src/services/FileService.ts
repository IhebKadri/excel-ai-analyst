import fs from 'fs/promises';
import 'multer';
import { IFileParser } from '../interfaces/IFileParser';
import { IFileRepository } from '../interfaces/IFileRepository';
import { ApiError } from '../utils/ApiError';

export class FileService {
  constructor(
    private readonly fileRepo: IFileRepository,
    private readonly parser: IFileParser,
  ) {}

  async upload(userId: string, file: Express.Multer.File) {
    if (!this.parser.supports(file.mimetype)) {
      await fs.unlink(file.path).catch(() => null);
      throw ApiError.badRequest(`Unsupported file type: ${file.mimetype}`);
    }

    const existing = await this.fileRepo.findByUserIdAndName(userId, file.originalname);
    if (existing) {
      await fs.unlink(existing.storagePath).catch(() => null);
      await this.fileRepo.delete(existing.id);
    }

    const saved = await this.fileRepo.save({
      userId,
      originalName: file.originalname,
      storagePath: file.path,
      mimeType: file.mimetype,
      sizeBytes: file.size,
    });

    return saved;
  }

  async getUserFiles(userId: string) {
    return this.fileRepo.findByUserId(userId);
  }

  async deleteFile(fileId: string, userId: string): Promise<void> {
    const file = await this.fileRepo.findById(fileId);
    if (!file) throw ApiError.notFound('File not found');
    if (file.userId !== userId) throw ApiError.unauthorized();

    await fs.unlink(file.storagePath).catch(() => null);
    await this.fileRepo.delete(fileId);
  }
}
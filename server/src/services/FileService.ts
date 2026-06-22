import fs from 'fs/promises';
import 'multer';
import { IFileParser } from '../interfaces/IFileParser';
import { IFileRepository } from '../interfaces/IFileRepository';
import { IEmbeddingService } from '../interfaces/IEmbeddingService';
import { IChunkRepository } from '../interfaces/IChunkRepository';
import { chunkSheets } from '../utils/chunkUtils';
import { ApiError } from '../utils/ApiError';
import { logger } from '../utils/logger';

export class FileService {
  constructor(
    private readonly fileRepo: IFileRepository,
    private readonly parser: IFileParser,
    private readonly embeddingService: IEmbeddingService,
    private readonly chunkRepo: IChunkRepository,
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

    this.processChunks(saved.id, userId, file.path).catch((err) =>
      logger.error(`Failed to process chunks for file ${saved.id}`, err),
    );

    return saved;
  }

  private async processChunks(fileId: string, userId: string, filePath: string): Promise<void> {
    const buffer = await fs.readFile(filePath);
    const sheets = await this.parser.parse(buffer);
    const textChunks = chunkSheets(sheets);

    logger.info(`Embedding ${textChunks.length} chunks for file ${fileId}`);

    const embeddings = await Promise.all(
      textChunks.map((chunk) => this.embeddingService.embed(chunk.content)),
    );

    await this.chunkRepo.saveMany(
      textChunks.map((chunk) => ({
        fileId,
        userId,
        content: chunk.content,
        chunkIndex: chunk.chunkIndex,
      })),
      embeddings,
    );

    logger.info(`Successfully stored ${textChunks.length} chunks for file ${fileId}`);
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
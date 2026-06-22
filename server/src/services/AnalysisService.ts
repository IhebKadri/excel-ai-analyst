import fs from 'fs/promises';
import { IFileParser } from '../interfaces/IFileParser';
import { IAIService, ChatMessage } from '../interfaces/IAIService';
import { IFileRepository } from '../interfaces/IFileRepository';
import { IEmbeddingService } from '../interfaces/IEmbeddingService';
import { IChunkRepository } from '../interfaces/IChunkRepository';
import { ApiError } from '../utils/ApiError';
import { logger } from '../utils/logger';

const MAX_ROWS_IN_CONTEXT = 50;
const MAX_HISTORY_MESSAGES = 10;
const TOP_K_CHUNKS = 5;
const MIN_SIMILARITY = 0.5;

export class AnalysisService {
  constructor(
    private readonly parser: IFileParser,
    private readonly aiService: IAIService,
    private readonly fileRepo: IFileRepository,
    private readonly embeddingService: IEmbeddingService,
    private readonly chunkRepo: IChunkRepository,
  ) {}

  async ask(
    fileId: string,
    userId: string,
    question: string,
    history: ChatMessage[] = [],
  ): Promise<string> {
    const file = await this.fileRepo.findById(fileId);
    if (!file) throw ApiError.notFound(`File not found: ${fileId}`);
    if (file.userId !== userId) throw ApiError.unauthorized();

    const trimmedHistory = history.slice(-MAX_HISTORY_MESSAGES);

    const questionEmbedding = await this.embeddingService.embed(question);
    const similarChunks = await this.chunkRepo.findSimilar(fileId, questionEmbedding, TOP_K_CHUNKS);
    const relevantChunks = similarChunks.filter((c) => c.similarity >= MIN_SIMILARITY);

    let context: string;

    if (relevantChunks.length > 0) {
      logger.info(`found ${relevantChunks.length} relevant chunks for file ${fileId}`);
      context = relevantChunks
        .sort((a, b) => a.chunkIndex - b.chunkIndex)
        .map((c) => c.content)
        .join('\n\n---\n\n');
    } else {
      logger.info(`no relevant chunks found, falling back to full sheet for file ${fileId}`);
      const buffer = await this.readFile(file.storagePath);
      const sheets = await this.parser.parse(buffer);
      context = this.buildContext(sheets);
    }

    const { answer } = await this.aiService.ask(question, context, trimmedHistory);
    return answer;
  }

  async generateReport(fileId: string, userId: string) {
    const file = await this.fileRepo.findById(fileId);
    if (!file) throw ApiError.notFound(`File not found: ${fileId}`);
    if (file.userId !== userId) throw ApiError.unauthorized();

    const buffer = await this.readFile(file.storagePath);
    const sheets = await this.parser.parse(buffer);
    const context = this.buildContext(sheets);

    logger.info(`Generating report for file ${fileId}`);
    const [summaryResult, insightsResult] = await Promise.all([
      this.aiService.summarize(context),
      this.aiService.extractInsights(context),
    ]);

    const totalTokens = summaryResult.tokensUsed + insightsResult.tokensUsed;
    logger.info(`Report generated for file ${fileId}`, { totalTokens });

    return {
      summary: summaryResult.text,
      insights: insightsResult.insights,
      tokensUsed: totalTokens,
    };
  }

  private buildContext(sheets: Awaited<ReturnType<IFileParser['parse']>>): string {
    return sheets
      .map((sheet) => {
        const sample = sheet.rows.slice(0, MAX_ROWS_IN_CONTEXT);
        return [
          `Sheet: "${sheet.sheetName}" (${sheet.totalRows} total rows)`,
          `Headers: ${sheet.headers.join(', ')}`,
          `Data:\n${JSON.stringify(sample, null, 2)}`,
        ].join('\n');
      })
      .join('\n\n---\n\n');
  }

  private async readFile(storagePath: string): Promise<Buffer> {
    try {
      return await fs.readFile(storagePath);
    } catch {
      throw ApiError.notFound('File not found on disk');
    }
  }
}
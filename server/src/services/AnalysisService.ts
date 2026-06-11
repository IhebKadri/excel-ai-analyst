import fs from 'fs/promises';
import { IFileParser } from '../interfaces/IFileParser';
import { IAIService, ChatMessage } from '../interfaces/IAIService';
import { IFileRepository } from '../interfaces/IFileRepository';
import { ApiError } from '../utils/ApiError';
import { logger } from '../utils/logger';

const MAX_ROWS_IN_CONTEXT = 100;

export class AnalysisService {
  constructor(
    private readonly parser: IFileParser,
    private readonly aiService: IAIService,
    private readonly fileRepo: IFileRepository,
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

    const buffer = await this.readFile(file.storagePath);
    const sheets = await this.parser.parse(buffer);
    const context = this.buildContext(sheets);

    logger.info(`Asking AI about file ${fileId}`, { question });
    const { answer } = await this.aiService.ask(question, context, history);
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
    const [summary, insights] = await Promise.all([
      this.aiService.summarize(context),
      this.aiService.extractInsights(context),
    ]);

    return { summary, insights };
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
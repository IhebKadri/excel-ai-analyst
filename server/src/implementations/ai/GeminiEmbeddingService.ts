import { GoogleGenAI } from '@google/genai';
import { IEmbeddingService } from '../../interfaces/IEmbeddingService';
import { env } from '../../config/env';

const OUTPUT_DIMENSIONS = 768;

export class GeminiEmbeddingService implements IEmbeddingService {
  private readonly ai: GoogleGenAI;
  private readonly model = 'gemini-embedding-001';

  constructor() {
    this.ai = new GoogleGenAI({ apiKey: env.geminiApiKey });
  }

  async embed(text: string): Promise<number[]> {
    const result = await this.ai.models.embedContent({
      model: this.model,
      contents: text,
      config: {
        outputDimensionality: OUTPUT_DIMENSIONS,
        taskType: 'RETRIEVAL_DOCUMENT',
      },
    });

    return result.embeddings?.[0]?.values ?? [];
  }
}
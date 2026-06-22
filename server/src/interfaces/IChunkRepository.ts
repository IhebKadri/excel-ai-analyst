export interface Chunk {
  id: string;
  fileId: string;
  userId: string;
  content: string;
  chunkIndex: number;
  createdAt: Date;
}

export interface SimilarChunk extends Chunk {
  similarity: number;
}

export interface IChunkRepository {
  saveMany(chunks: Omit<Chunk, 'id' | 'createdAt'>[], embeddings: number[][]): Promise<void>;
  findSimilar(fileId: string, queryEmbedding: number[], topK: number): Promise<SimilarChunk[]>;
  deleteByFileId(fileId: string): Promise<void>;
}
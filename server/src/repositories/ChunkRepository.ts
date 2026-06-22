import { prisma } from "../config/database";
import { Prisma } from "@prisma/client";
import { Pool } from "pg";
import {
  IChunkRepository,
  Chunk,
  SimilarChunk,
} from "../interfaces/IChunkRepository";
import { v4 as uuidv4 } from "uuid";

export class ChunkRepository implements IChunkRepository {
  private pool = new Pool({ connectionString: process.env.DATABASE_URL });

  async saveMany(
    chunks: Omit<Chunk, "id" | "createdAt">[],
    embeddings: number[][],
  ): Promise<void> {
    await Promise.all(
      chunks.map((chunk, i) => {
        const id = uuidv4();
        const embedding = embeddings[i];
        const vectorLiteral = `[${embedding.join(",")}]`;

        return prisma.$executeRaw`
          INSERT INTO chunks (id, file_id, user_id, content, embedding, chunk_index, created_at)
          VALUES (
            ${id}::uuid,
            ${chunk.fileId}::uuid,
            ${chunk.userId}::uuid,
            ${chunk.content},
            ${vectorLiteral}::vector,
            ${chunk.chunkIndex},
            NOW()
          )
        `;
      }),
    );
  }

  async findSimilar(
    fileId: string,
    queryEmbedding: number[],
    topK: number,
  ): Promise<SimilarChunk[]> {
    const vectorLiteral = `[${queryEmbedding.join(",")}]`;

    const result = await this.pool.query(
      `
  SELECT
    id::text,
    file_id::text,
    user_id::text,
    content,
    chunk_index,
    created_at,
    1 - (embedding <=> $1::vector) AS similarity
  FROM chunks
  WHERE file_id::text = $2
  ORDER BY embedding <=> $1::vector
  LIMIT $3
`,
      [vectorLiteral, fileId, topK],
    );

    return result.rows.map(
      (row: {
        id: string;
        file_id: string;
        user_id: string;
        content: string;
        chunk_index: number;
        created_at: Date;
        similarity: number;
      }) => ({
        id: row.id,
        fileId: row.file_id,
        userId: row.user_id,
        content: row.content,
        chunkIndex: Number(row.chunk_index),
        createdAt: row.created_at,
        similarity: Number(row.similarity),
      }),
    );
  }

  async deleteByFileId(fileId: string): Promise<void> {
    await prisma.chunk.deleteMany({ where: { fileId } });
  }
}

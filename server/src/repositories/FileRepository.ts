import { prisma } from "../config/database";
import { UploadedFile } from "../domain/UploadedFile";
import {
  IFileRepository,
  CreateFileInput,
} from "../interfaces/IFileRepository";

export class FileRepository implements IFileRepository {
  async save(input: CreateFileInput): Promise<UploadedFile> {
    const row = await prisma.file.create({ data: { ...input } });
    return this.toDomain(row);
  }

  async findById(id: string): Promise<UploadedFile | null> {
    const row = await prisma.file.findUnique({ where: { id } });
    return row ? this.toDomain(row) : null;
  }

  async findByUserId(userId: string): Promise<UploadedFile[]> {
    const rows = await prisma.file.findMany({
      where: { userId },
      orderBy: { uploadedAt: "desc" },
    });
    return rows.map((r) => this.toDomain(r));
  }

  async findByUserIdAndName(
    userId: string,
    originalName: string,
  ): Promise<UploadedFile | null> {
    const row = await prisma.file.findUnique({
      where: { userId_originalName: { userId, originalName } },
    });
    return row ? this.toDomain(row) : null;
  }
  
  async delete(id: string): Promise<void> {
    await prisma.file.delete({ where: { id } });
  }

  private toDomain(row: {
    id: string;
    userId: string;
    originalName: string;
    storagePath: string;
    mimeType: string;
    sizeBytes: number;
    uploadedAt: Date;
  }): UploadedFile {
    return new UploadedFile(
      row.id,
      row.userId,
      row.originalName,
      row.storagePath,
      row.mimeType,
      row.sizeBytes,
      row.uploadedAt,
    );
  }
}

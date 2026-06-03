import { UploadedFile } from "../domain/UploadedFile";

export type CreateFileInput = Omit<UploadedFile, "id" | "uploadedAt">;

export interface IFileRepository {
  save(input: CreateFileInput): Promise<UploadedFile>;
  findById(id: string): Promise<UploadedFile | null>;
  findByUserId(userId: string): Promise<UploadedFile[]>;
  delete(id: string): Promise<void>;
}

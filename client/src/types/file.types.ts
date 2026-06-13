export interface UploadedFile {
  id: string;
  userId: string;
  originalName: string;
  storagePath: string;
  mimeType: string;
  sizeBytes: number;
  uploadedAt: string;
}
export class UploadedFile {
  constructor(
    public readonly id: string,
    public readonly userId: string,
    public readonly originalName: string,
    public readonly storagePath: string,
    public readonly mimeType: string,
    public readonly sizeBytes: number,
    public readonly uploadedAt: Date,
  ) {}
}
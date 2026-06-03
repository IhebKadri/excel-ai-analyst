export type ReportStatus = "pending" | "ready" | "failed";

export class Report {
  constructor(
    public readonly id: string,
    public readonly fileId: string,
    public readonly userId: string,
    public readonly summary: string,
    public readonly insights: string[],
    public readonly status: ReportStatus,
    public readonly createdAt: Date,
  ) {}
}

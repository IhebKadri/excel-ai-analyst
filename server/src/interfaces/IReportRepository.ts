import { Report } from "../domain/Report";

export interface IReportRepository {
  save(report: Omit<Report, "id" | "createdAt">): Promise<Report>;
  findByFileId(fileId: string): Promise<Report | null>;
  findByUserId(userId: string): Promise<Report[]>;
}

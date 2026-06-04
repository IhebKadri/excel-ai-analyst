import { prisma } from '../config/database';
import { Report } from '../domain/Report';
import { IReportRepository } from '../interfaces/IReportRepository';

export class ReportRepository implements IReportRepository {
  async save(input: Omit<Report, 'id' | 'createdAt'>): Promise<Report> {
    const row = await prisma.report.create({
      data: {
        fileId: input.fileId,
        userId: input.userId,
        summary: input.summary,
        insights: input.insights,
        status: input.status,
      },
    });
    return this.toDomain(row);
  }

  async findByFileId(fileId: string): Promise<Report | null> {
    const row = await prisma.report.findFirst({ where: { fileId } });
    return row ? this.toDomain(row) : null;
  }

  async findByUserId(userId: string): Promise<Report[]> {
    const rows = await prisma.report.findMany({
      where: { userId },
      orderBy: { createdAt: 'desc' },
    });
    return rows.map((r) => this.toDomain(r));
  }

  private toDomain(row: {
    id: string;
    fileId: string;
    userId: string;
    summary: string;
    insights: unknown;
    status: string;
    createdAt: Date;
  }): Report {
    return new Report(
      row.id,
      row.fileId,
      row.userId,
      row.summary,
      row.insights as string[],
      row.status as Report['status'],
      row.createdAt,
    );
  }
}
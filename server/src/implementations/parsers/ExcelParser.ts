import * as XLSX from 'xlsx';
import { IFileParser, ParsedSheet } from '../../interfaces/IFileParser';

export class ExcelParser implements IFileParser {
  private readonly SUPPORTED_MIME_TYPES = [
    'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
    'application/vnd.ms-excel',
  ];

  supports(mimeType: string): boolean {
    return this.SUPPORTED_MIME_TYPES.includes(mimeType);
  }

  async parse(buffer: Buffer): Promise<ParsedSheet[]> {
    const workbook = XLSX.read(buffer, { type: 'buffer', cellDates: true });

    return workbook.SheetNames.map((sheetName) => {
      const worksheet = workbook.Sheets[sheetName];
      const rows = XLSX.utils.sheet_to_json<Record<string, unknown>>(worksheet, {
        defval: null,
      });
      const headers = rows.length > 0 ? Object.keys(rows[0]) : [];

      return {
        sheetName,
        headers,
        rows,
        totalRows: rows.length,
      };
    });
  }
}
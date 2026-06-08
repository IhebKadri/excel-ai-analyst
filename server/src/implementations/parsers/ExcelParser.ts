import * as XLSX from 'xlsx';
import { IFileParser, ParsedSheet } from '../../interfaces/IFileParser';
import { detectTables } from '../../utils/sheetUtils';

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
      const raw = XLSX.utils.sheet_to_json<unknown[]>(worksheet, {
        header: 1,
        defval: null,
      });

      const tables = detectTables(raw);
      const rows = tables.flatMap((t) => t.rows);
      const headers = [...new Set(tables.flatMap((t) => t.headers))];

      return { sheetName, headers, rows, totalRows: rows.length };
    });
  }
}
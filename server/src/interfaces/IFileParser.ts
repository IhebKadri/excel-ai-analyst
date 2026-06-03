export interface ParsedSheet {
  sheetName: string;
  headers: string[];
  rows: Record<string, unknown>[];
  totalRows: number;
}

export interface IFileParser {
  supports(mimeType: string): boolean;
  parse(buffer: Buffer): Promise<ParsedSheet[]>;
}

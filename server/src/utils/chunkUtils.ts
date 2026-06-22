import { ParsedSheet } from '../interfaces/IFileParser';

export interface TextChunk {
  content: string;
  chunkIndex: number;
}

const ROWS_PER_CHUNK = 20;

export function chunkSheets(sheets: ParsedSheet[]): TextChunk[] {
  const chunks: TextChunk[] = [];
  let globalIndex = 0;

  for (const sheet of sheets) {
    for (let i = 0; i < sheet.rows.length; i += ROWS_PER_CHUNK) {
      const rowSlice = sheet.rows.slice(i, i + ROWS_PER_CHUNK);
      const content = buildChunkContent(sheet.sheetName, sheet.headers, rowSlice, i);
      chunks.push({ content, chunkIndex: globalIndex });
      globalIndex++;
    }
  }

  return chunks;
}

function buildChunkContent(
  sheetName: string,
  headers: string[],
  rows: Record<string, unknown>[],
  startRow: number,
): string {
  const rowStrings = rows.map((row, i) =>
    `Row ${startRow + i + 1}: ${headers.map((h) => `${h}=${row[h] ?? 'null'}`).join(', ')}`
  );

  return [
    `Sheet: "${sheetName}"`,
    `Headers: ${headers.join(', ')}`,
    ...rowStrings,
  ].join('\n');
}
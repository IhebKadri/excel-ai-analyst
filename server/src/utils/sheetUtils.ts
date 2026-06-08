export function isEmptyRow(row: unknown[]): boolean {
  return !row || row.every((cell) => cell === null || cell === '');
}

export function isHeaderRow(row: unknown[]): boolean {
  if (!row || row.length === 0) return false;
  const nonNullCells = row.filter((cell) => cell !== null && cell !== '');
  if (nonNullCells.length === 0) return false;
  const stringCells = nonNullCells.filter((cell) => typeof cell === 'string');
  return stringCells.length / nonNullCells.length >= 0.6;
}

export function detectTables(raw: unknown[][]): { headers: string[]; rows: Record<string, unknown>[] }[] {
  const tables: { headers: string[]; rows: Record<string, unknown>[] }[] = [];
  let i = 0;

  while (i < raw.length) {
    if (isEmptyRow(raw[i])) { i++; continue; }

    if (isHeaderRow(raw[i])) {
      const firstNonNull = raw[i].findIndex((cell) => cell !== null && cell !== '');

      const headers = raw[i]
        .slice(firstNonNull)
        .filter((h): h is string => typeof h === 'string' && h.trim() !== '')
        .map((h) => h.trim().toLowerCase());

      const rows: Record<string, unknown>[] = [];
      i++;

      while (i < raw.length && !isEmptyRow(raw[i]) && !isHeaderRow(raw[i])) {
        const rawRow = raw[i].slice(firstNonNull);
        if (rawRow.every((cell) => cell === null || cell === '')) {
          i++;
          continue;
        }

        const row: Record<string, unknown> = {};
        headers.forEach((header, idx) => { row[header] = rawRow[idx] ?? null; });
        rows.push(row);
        i++;
      }

      if (rows.length > 0) tables.push({ headers, rows });
      continue;
    }

    i++;
  }

  return tables;
}
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
  let expectingHeader = true; // only true at the very start, or right after an empty row

  while (i < raw.length) {
    if (isEmptyRow(raw[i])) {
      expectingHeader = true; // a gap means the next real row could be a new header
      i++;
      continue;
    }

    if (expectingHeader && isHeaderRow(raw[i])) {
      const firstNonNull = raw[i].findIndex((cell) => cell !== null && cell !== '');

      const headers = raw[i]
        .slice(firstNonNull)
        .filter((h): h is string => typeof h === 'string' && h.trim() !== '')
        .map((h) => h.trim().toLowerCase());

      const rows: Record<string, unknown>[] = [];
      i++;
      expectingHeader = false; // we just consumed the header, everything next is data until a gap

      while (i < raw.length && !isEmptyRow(raw[i])) {
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

    // Not expecting a header and this isn't an empty row — treat as stray/unparseable, skip it
    i++;
  }

  return tables;
}
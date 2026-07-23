/** Format a Date as YYYY-MM-DD in local time */
export function toISODate(d: Date): string {
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${y}-${m}-${day}`;
}

/** Parse YYYY-MM-DD as local date (not UTC) */
export function parseISODate(iso: string): Date | null {
  if (!iso || !/^\d{4}-\d{2}-\d{2}$/.test(iso)) return null;
  const [y, m, d] = iso.split("-").map(Number);
  const date = new Date(y, m - 1, d);
  if (
    date.getFullYear() !== y ||
    date.getMonth() !== m - 1 ||
    date.getDate() !== d
  ) {
    return null;
  }
  return date;
}

/** Display as DD / MM / YYYY */
export function formatDisplayDate(iso: string): string {
  const d = parseISODate(iso);
  if (!d) return "__ / __ / ____";
  const dd = String(d.getDate()).padStart(2, "0");
  const mm = String(d.getMonth() + 1).padStart(2, "0");
  const yyyy = d.getFullYear();
  return `${dd} / ${mm} / ${yyyy}`;
}

/** Display partial buffer as DD / MM / YYYY while typing (digits = DDMM or DDMMYYYY) */
export function formatBufferDisplay(buffer: string, yearHint = 2026): string {
  const digits = buffer.replace(/\D/g, "").slice(0, 8);
  const dd = digits.slice(0, 2).padEnd(2, "_");
  const mm = digits.slice(2, 4).padEnd(2, "_");
  let yyyy: string;
  if (digits.length <= 4) {
    yyyy = String(yearHint);
  } else {
    yyyy = digits.slice(4, 8).padEnd(4, "_");
  }
  return `${dd} / ${mm} / ${yyyy}`;
}

/**
 * Build ISO date from digit buffer.
 * - 4 digits: DDMM → use yearHint
 * - 8 digits: DDMMYYYY
 */
export function bufferToISO(buffer: string, yearHint = 2026): string | null {
  const digits = buffer.replace(/\D/g, "");
  if (digits.length !== 4 && digits.length !== 8) return null;

  const dd = parseInt(digits.slice(0, 2), 10);
  const mm = parseInt(digits.slice(2, 4), 10);
  const yyyy =
    digits.length === 8 ? parseInt(digits.slice(4, 8), 10) : yearHint;

  if (mm < 1 || mm > 12 || dd < 1 || dd > 31) return null;
  const date = new Date(yyyy, mm - 1, dd);
  if (
    date.getFullYear() !== yyyy ||
    date.getMonth() !== mm - 1 ||
    date.getDate() !== dd
  ) {
    return null;
  }
  return toISODate(date);
}

/** Whole weeks between two dates (signed: positive if end > start) */
export function weeksBetween(startISO: string, endISO: string): number | null {
  const start = parseISODate(startISO);
  const end = parseISODate(endISO);
  if (!start || !end) return null;
  const ms = end.getTime() - start.getTime();
  return Math.round(ms / (7 * 24 * 60 * 60 * 1000));
}

/** Signed week difference: recent relative to today (positive if recent is later) */
export function weeksFromToday(iso: string, today = new Date()): number | null {
  const d = parseISODate(iso);
  if (!d) return null;
  const t = new Date(today.getFullYear(), today.getMonth(), today.getDate());
  const ms = d.getTime() - t.getTime();
  return Math.round(ms / (7 * 24 * 60 * 60 * 1000));
}

export function todayISO(): string {
  return toISODate(new Date());
}

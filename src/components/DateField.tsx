"use client";

import { formatBufferDisplay, formatDisplayDate } from "@/lib/dates";

interface DateFieldProps {
  label: string;
  value: string;
  active: boolean;
  digitBuffer: string;
  onSelect: () => void;
}

export function DateFieldDisplay({
  label,
  value,
  active,
  digitBuffer,
  onSelect,
}: DateFieldProps) {
  const display =
    active && digitBuffer.length > 0
      ? formatBufferDisplay(digitBuffer)
      : value
        ? formatDisplayDate(value)
        : formatBufferDisplay("");

  return (
    <button
      type="button"
      onClick={onSelect}
      className={["date-field", active ? "date-field-active" : ""]
        .filter(Boolean)
        .join(" ")}
    >
      <span className="date-field-label">{label}</span>
      <span className="date-field-value font-mono tracking-wide">{display}</span>
    </button>
  );
}

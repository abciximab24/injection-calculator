"use client";

interface NumberPadProps {
  onDigit: (d: string) => void;
  onClear: () => void;
  onBackspace: () => void;
  onToday: () => void;
}

export function NumberPad({
  onDigit,
  onClear,
  onBackspace,
  onToday,
}: NumberPadProps) {
  const keys = ["1", "2", "3", "4", "5", "6", "7", "8", "9"];

  return (
    <div className="grid grid-cols-3 gap-2">
      {keys.map((k) => (
        <button
          key={k}
          type="button"
          onClick={() => onDigit(k)}
          className="num-key"
        >
          {k}
        </button>
      ))}
      <button type="button" onClick={onClear} className="num-key num-key-muted">
        C
      </button>
      <button type="button" onClick={() => onDigit("0")} className="num-key">
        0
      </button>
      <button
        type="button"
        onClick={onBackspace}
        className="num-key num-key-muted"
        aria-label="Backspace"
      >
        ⌫
      </button>
      <button
        type="button"
        onClick={onToday}
        className="col-span-3 num-key num-key-today"
      >
        Today
      </button>
    </div>
  );
}

"use client";

interface ToggleChipProps {
  label: string;
  selected: boolean;
  onClick: () => void;
  disabled?: boolean;
  variant?: "default" | "optional";
}

export function ToggleChip({
  label,
  selected,
  onClick,
  disabled = false,
  variant = "default",
}: ToggleChipProps) {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      className={[
        "chip",
        selected ? "chip-selected" : "",
        variant === "optional" ? "chip-optional" : "",
        disabled ? "opacity-40 cursor-not-allowed" : "",
      ]
        .filter(Boolean)
        .join(" ")}
    >
      {label}
    </button>
  );
}

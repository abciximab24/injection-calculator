import type { Stage2State } from "./types";
import { weeksFromToday } from "./dates";

/**
 * Build the 2D barcode text per clinical spec.
 *
 * Template:
 * <<< List: {eye} {drug}; {eye} {dx}; Q{n}wk  MP {eye}
 * Amsler grid, AREDS2 info
 * [Protect RE/LE if only-eye]
 * FU Same Day VR Clinic VA IOP MPBE   OR   FU VR Clinic 1/52 before injection VA IOP MPBE
 * <<< OCT-m BE n/v MPBE
 */
export function buildBarcodeText(
  nextInjectionWeeks: number,
  stage2: Stage2State
): { text: string; qWeeks: number } | null {
  const { eye, diagnosis, drug, recentInjection, onlyEye, fuOctBefore } =
    stage2;

  if (!eye || !diagnosis || !drug || !recentInjection) return null;

  const delta = weeksFromToday(recentInjection);
  if (delta === null) return null;

  // Today → same; earlier → minus; later → plus
  const qWeeks = nextInjectionWeeks + delta;

  const lines: string[] = [
    `<<< List: ${eye} ${drug}; ${eye} ${diagnosis}; Q${qWeeks}wk  MP ${eye}`,
    "Amsler grid, AREDS2 info",
  ];

  if (onlyEye === "RE only eye") {
    lines.push("Protect RE");
  } else if (onlyEye === "LE only eye") {
    lines.push("Protect LE");
  }

  if (fuOctBefore) {
    lines.push("FU VR Clinic 1/52 before injection VA IOP MPBE");
  } else {
    lines.push("FU Same Day VR Clinic VA IOP MPBE");
  }

  lines.push("<<< OCT-m BE n/v MPBE");

  return { text: lines.join("\n"), qWeeks };
}

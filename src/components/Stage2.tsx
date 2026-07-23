"use client";

import { useEffect, useState } from "react";
import QRCode from "qrcode";
import { DateFieldDisplay } from "./DateField";
import { NumberPad } from "./NumberPad";
import { ToggleChip } from "./ToggleChip";
import { buildBarcodeText } from "@/lib/barcode";
import type {
  DateField,
  Diagnosis,
  Drug,
  Eye,
  OnlyEye,
  Stage2State,
} from "@/lib/types";

interface Stage2Props {
  nextInjectionWeeks: number;
  state: Stage2State;
  activeField: DateField;
  digitBuffer: string;
  onSelectField: (field: DateField) => void;
  onDigit: (d: string) => void;
  onClear: () => void;
  onBackspace: () => void;
  onToday: () => void;
  onSetEye: (eye: Eye) => void;
  onSetDiagnosis: (dx: Diagnosis) => void;
  onSetOnlyEye: (v: OnlyEye) => void;
  onSetDrug: (drug: Drug) => void;
  onToggleFu: () => void;
  onBack: () => void;
}

export function Stage2({
  nextInjectionWeeks,
  state,
  activeField,
  digitBuffer,
  onSelectField,
  onDigit,
  onClear,
  onBackspace,
  onToday,
  onSetEye,
  onSetDiagnosis,
  onSetOnlyEye,
  onSetDrug,
  onToggleFu,
  onBack,
}: Stage2Props) {
  const [barcodeText, setBarcodeText] = useState<string | null>(null);
  const [qWeeks, setQWeeks] = useState<number | null>(null);
  const [qrDataUrl, setQrDataUrl] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const canEnter =
    !!state.eye &&
    !!state.diagnosis &&
    !!state.drug &&
    !!state.recentInjection;

  async function handleEnter() {
    setError(null);
    const result = buildBarcodeText(nextInjectionWeeks, state);
    if (!result) {
      setError(
        "Complete required fields: Recent injection date, RE/LE, wAMD/PCV, and drug."
      );
      setBarcodeText(null);
      setQrDataUrl(null);
      return;
    }
    setBarcodeText(result.text);
    setQWeeks(result.qWeeks);
    try {
      const url = await QRCode.toDataURL(result.text, {
        errorCorrectionLevel: "M",
        margin: 2,
        width: 280,
        color: { dark: "#0f172a", light: "#ffffff" },
      });
      setQrDataUrl(url);
    } catch {
      setError("Failed to generate QR code.");
    }
  }

  // Clear barcode when inputs change after generation
  useEffect(() => {
    setBarcodeText(null);
    setQrDataUrl(null);
    setQWeeks(null);
  }, [
    state.eye,
    state.diagnosis,
    state.drug,
    state.recentInjection,
    state.onlyEye,
    state.fuOctBefore,
    nextInjectionWeeks,
  ]);

  return (
    <div className="stage-grid stage-grid-wide">
      <div className="panel space-y-4">
        <header className="panel-header">
          <div className="flex items-center justify-between gap-3">
            <span className="badge">Stage 2</span>
            <button type="button" className="link-btn" onClick={onBack}>
              ← Back to Stage 1
            </button>
          </div>
          <h2 className="panel-title">Clinical options & barcode</h2>
          <p className="panel-sub">
            Next injection interval:{" "}
            <strong className="text-slate-800">{nextInjectionWeeks} weeks</strong>
          </p>
        </header>

        <DateFieldDisplay
          label="Recent past / upcoming injection"
          value={state.recentInjection}
          active={activeField === "recentInjection"}
          digitBuffer={digitBuffer}
          onSelect={() => onSelectField("recentInjection")}
        />

        <section>
          <h3 className="section-label">
            Eye <span className="req">required · pick one</span>
          </h3>
          <div className="chip-row">
            <ToggleChip
              label="RE"
              selected={state.eye === "RE"}
              onClick={() => onSetEye("RE")}
            />
            <ToggleChip
              label="LE"
              selected={state.eye === "LE"}
              onClick={() => onSetEye("LE")}
            />
          </div>
        </section>

        <section>
          <h3 className="section-label">
            Diagnosis <span className="req">required · pick one</span>
          </h3>
          <div className="chip-row">
            <ToggleChip
              label="wAMD"
              selected={state.diagnosis === "wAMD"}
              onClick={() => onSetDiagnosis("wAMD")}
            />
            <ToggleChip
              label="PCV"
              selected={state.diagnosis === "PCV"}
              onClick={() => onSetDiagnosis("PCV")}
            />
          </div>
        </section>

        <section>
          <h3 className="section-label">
            Only eye <span className="opt">optional · pick one or none</span>
          </h3>
          <div className="chip-row">
            <ToggleChip
              label="RE only eye"
              selected={state.onlyEye === "RE only eye"}
              onClick={() =>
                onSetOnlyEye(
                  state.onlyEye === "RE only eye" ? null : "RE only eye"
                )
              }
              variant="optional"
            />
            <ToggleChip
              label="LE only eye"
              selected={state.onlyEye === "LE only eye"}
              onClick={() =>
                onSetOnlyEye(
                  state.onlyEye === "LE only eye" ? null : "LE only eye"
                )
              }
              variant="optional"
            />
          </div>
        </section>

        <section>
          <h3 className="section-label">
            Drug <span className="req">required · pick one</span>
          </h3>
          <div className="chip-row">
            {(
              [
                "Eylea 8mg",
                "Eylea 2mg",
                "Vabysmo",
                "Lucentis",
              ] as Drug[]
            ).map((d) => (
              <ToggleChip
                key={d}
                label={d}
                selected={state.drug === d}
                onClick={() => onSetDrug(d)}
              />
            ))}
          </div>
        </section>

        <section>
          <h3 className="section-label">
            Follow-up <span className="opt">optional</span>
          </h3>
          <div className="chip-row">
            <ToggleChip
              label="FU + OCT-m 1 week before"
              selected={state.fuOctBefore}
              onClick={onToggleFu}
              variant="optional"
            />
          </div>
        </section>

        <button
          type="button"
          className="primary-btn w-full"
          disabled={!canEnter}
          onClick={handleEnter}
        >
          Enter — generate 2D barcode
        </button>
        {error && <p className="error-text">{error}</p>}
      </div>

      <div className="space-y-4">
        <div className="panel">
          <header className="panel-header mb-4">
            <h2 className="panel-title text-lg">Number pad</h2>
            <p className="panel-sub">
              Enter recent past / upcoming injection date.
            </p>
          </header>
          <NumberPad
            onDigit={onDigit}
            onClear={onClear}
            onBackspace={onBackspace}
            onToday={onToday}
          />
        </div>

        <div className="panel barcode-panel">
          <header className="panel-header mb-3">
            <h2 className="panel-title text-lg">2D barcode</h2>
            {qWeeks !== null && (
              <p className="panel-sub">
                Calculated interval: <strong>Q{qWeeks}wk</strong>
              </p>
            )}
          </header>

          {!qrDataUrl && (
            <p className="text-sm text-slate-500">
              Complete required fields and press Enter to generate.
            </p>
          )}

          {qrDataUrl && barcodeText && (
            <div className="barcode-result">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={qrDataUrl}
                alt="2D barcode QR code"
                className="qr-image"
              />
              <pre className="barcode-text">{barcodeText}</pre>
              <button
                type="button"
                className="secondary-btn"
                onClick={() => {
                  navigator.clipboard?.writeText(barcodeText);
                }}
              >
                Copy text
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

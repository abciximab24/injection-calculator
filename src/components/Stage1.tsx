"use client";

import { DateFieldDisplay } from "./DateField";
import { NumberPad } from "./NumberPad";
import type { DateField, Stage1State } from "@/lib/types";

interface Stage1Props {
  state: Stage1State;
  activeField: DateField;
  digitBuffer: string;
  onSelectField: (field: DateField) => void;
  onDigit: (d: string) => void;
  onClear: () => void;
  onBackspace: () => void;
  onToday: () => void;
  onKeep: () => void;
  onExtend: () => void;
  onShorten: () => void;
  onContinue: () => void;
}

export function Stage1({
  state,
  activeField,
  digitBuffer,
  onSelectField,
  onDigit,
  onClear,
  onBackspace,
  onToday,
  onKeep,
  onExtend,
  onShorten,
  onContinue,
}: Stage1Props) {
  const canAdjust =
    state.noOfWeeks !== null && Number.isFinite(state.noOfWeeks);
  const canContinue =
    state.nextInjectionWeeks !== null && state.adjustment !== null;

  return (
    <div className="stage-grid">
      <div className="panel space-y-4">
        <header className="panel-header">
          <span className="badge">Stage 1</span>
          <h2 className="panel-title">Injection interval</h2>
          <p className="panel-sub">
            Enter dates, then Keep / Extend / Shorten to set next injection
            weeks.
          </p>
        </header>

        <DateFieldDisplay
          label="Date of last injection"
          value={state.lastInjection}
          active={activeField === "lastInjection"}
          digitBuffer={digitBuffer}
          onSelect={() => onSelectField("lastInjection")}
        />
        <DateFieldDisplay
          label="Date of OCT-m"
          value={state.octM}
          active={activeField === "octM"}
          digitBuffer={digitBuffer}
          onSelect={() => onSelectField("octM")}
        />

        <div className="stat-row">
          <div className="stat-card">
            <span className="stat-label">No. of weeks</span>
            <span className="stat-value">
              {state.noOfWeeks !== null ? state.noOfWeeks : "—"}
              <span className="stat-unit"> wk</span>
            </span>
            <span className="stat-hint">OCT-m − last injection</span>
          </div>
          <div className="stat-card stat-card-accent">
            <span className="stat-label">Next injection</span>
            <span className="stat-value">
              {state.nextInjectionWeeks !== null
                ? state.nextInjectionWeeks
                : "—"}
              <span className="stat-unit"> wk</span>
            </span>
            <span className="stat-hint">
              {state.adjustment === "keep" && "Keep interval"}
              {state.adjustment === "extend" && "Extended +2"}
              {state.adjustment === "shorten" && "Shortened −2"}
              {!state.adjustment && "Choose Keep / Extend / Shorten"}
            </span>
          </div>
        </div>

        <div className="action-row">
          <button
            type="button"
            className={[
              "action-btn action-keep",
              state.adjustment === "keep" ? "action-btn-active" : "",
            ]
              .filter(Boolean)
              .join(" ")}
            disabled={!canAdjust}
            onClick={onKeep}
          >
            Keep
          </button>
          <button
            type="button"
            className={[
              "action-btn action-extend",
              state.adjustment === "extend" ? "action-btn-active" : "",
            ]
              .filter(Boolean)
              .join(" ")}
            disabled={!canAdjust}
            onClick={onExtend}
          >
            Extend +2
          </button>
          <button
            type="button"
            className={[
              "action-btn action-shorten",
              state.adjustment === "shorten" ? "action-btn-active" : "",
            ]
              .filter(Boolean)
              .join(" ")}
            disabled={!canAdjust}
            onClick={onShorten}
          >
            Shorten −2
          </button>
        </div>

        <button
          type="button"
          className="primary-btn w-full"
          disabled={!canContinue}
          onClick={onContinue}
        >
          Continue to Stage 2 →
        </button>
      </div>

      <div className="panel">
        <header className="panel-header mb-4">
          <h2 className="panel-title text-lg">Number pad</h2>
          <p className="panel-sub">
            Select a date field, then type DD MM (year defaults to 2026) or
            DDMMYYYY.
          </p>
        </header>
        <NumberPad
          onDigit={onDigit}
          onClear={onClear}
          onBackspace={onBackspace}
          onToday={onToday}
        />
      </div>
    </div>
  );
}

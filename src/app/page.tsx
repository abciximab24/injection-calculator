"use client";

import { useCallback, useMemo, useState } from "react";
import { Stage1 } from "@/components/Stage1";
import { Stage2 } from "@/components/Stage2";
import {
  bufferToISO,
  todayISO,
  weeksBetween,
} from "@/lib/dates";
import type {
  DateField,
  Diagnosis,
  Drug,
  Eye,
  OnlyEye,
  Stage,
  Stage1State,
  Stage2State,
} from "@/lib/types";

const YEAR_HINT = 2026;

const initialStage1: Stage1State = {
  lastInjection: "",
  octM: "",
  noOfWeeks: null,
  nextInjectionWeeks: null,
  adjustment: null,
};

const initialStage2: Stage2State = {
  recentInjection: "",
  eye: null,
  diagnosis: null,
  onlyEye: null,
  drug: null,
  fuOctBefore: false,
};

function recomputeWeeks(
  lastInjection: string,
  octM: string,
  adjustment: Stage1State["adjustment"]
): Pick<Stage1State, "noOfWeeks" | "nextInjectionWeeks"> {
  const weeks =
    lastInjection && octM ? weeksBetween(lastInjection, octM) : null;
  if (weeks === null) {
    return { noOfWeeks: null, nextInjectionWeeks: null };
  }
  let next: number | null = null;
  if (adjustment === "keep") next = weeks;
  else if (adjustment === "extend") next = weeks + 2;
  else if (adjustment === "shorten") next = weeks - 2;
  return { noOfWeeks: weeks, nextInjectionWeeks: next };
}

export default function Home() {
  const [stage, setStage] = useState<Stage>(1);
  const [stage1, setStage1] = useState<Stage1State>(initialStage1);
  const [stage2, setStage2] = useState<Stage2State>(initialStage2);
  const [activeField, setActiveField] = useState<DateField>("lastInjection");
  const [digitBuffer, setDigitBuffer] = useState("");

  const commitBuffer = useCallback(
    (field: DateField, buffer: string) => {
      const iso = bufferToISO(buffer, YEAR_HINT);
      if (!iso) return;

      if (field === "lastInjection" || field === "octM") {
        setStage1((prev) => {
          const next = {
            ...prev,
            [field]: iso,
          };
          const recomputed = recomputeWeeks(
            next.lastInjection,
            next.octM,
            next.adjustment
          );
          return { ...next, ...recomputed };
        });
      } else if (field === "recentInjection") {
        setStage2((prev) => ({ ...prev, recentInjection: iso }));
      }
      setDigitBuffer("");
    },
    []
  );

  const onSelectField = useCallback((field: DateField) => {
    setActiveField(field);
    setDigitBuffer("");
  }, []);

  const onDigit = useCallback(
    (d: string) => {
      setDigitBuffer((prev) => {
        const next = (prev + d).replace(/\D/g, "").slice(0, 8);
        // Auto-commit when complete (4 = DDMM with year hint, or 8 = DDMMYYYY)
        if (next.length === 4 || next.length === 8) {
          // defer commit so state updates cleanly
          queueMicrotask(() => commitBuffer(activeField, next));
        }
        return next;
      });
    },
    [activeField, commitBuffer]
  );

  const onClear = useCallback(() => {
    setDigitBuffer("");
    if (activeField === "lastInjection" || activeField === "octM") {
      setStage1((prev) => {
        const next = { ...prev, [activeField]: "" };
        const recomputed = recomputeWeeks(
          next.lastInjection,
          next.octM,
          next.adjustment
        );
        return {
          ...next,
          ...recomputed,
          adjustment: recomputed.noOfWeeks === null ? null : prev.adjustment,
          nextInjectionWeeks:
            recomputed.noOfWeeks === null ? null : recomputed.nextInjectionWeeks,
        };
      });
    } else {
      setStage2((prev) => ({ ...prev, recentInjection: "" }));
    }
  }, [activeField]);

  const onBackspace = useCallback(() => {
    setDigitBuffer((prev) => prev.slice(0, -1));
  }, []);

  const onToday = useCallback(() => {
    const iso = todayISO();
    setDigitBuffer("");
    if (activeField === "lastInjection" || activeField === "octM") {
      setStage1((prev) => {
        const next = { ...prev, [activeField]: iso };
        const recomputed = recomputeWeeks(
          next.lastInjection,
          next.octM,
          next.adjustment
        );
        return { ...next, ...recomputed };
      });
    } else {
      setStage2((prev) => ({ ...prev, recentInjection: iso }));
    }
  }, [activeField]);

  const applyAdjustment = useCallback(
    (adjustment: "keep" | "extend" | "shorten") => {
      setStage1((prev) => {
        if (prev.noOfWeeks === null) return prev;
        const nextWeeks =
          adjustment === "keep"
            ? prev.noOfWeeks
            : adjustment === "extend"
              ? prev.noOfWeeks + 2
              : prev.noOfWeeks - 2;
        return {
          ...prev,
          adjustment,
          nextInjectionWeeks: nextWeeks,
        };
      });
    },
    []
  );

  const nextWeeks = stage1.nextInjectionWeeks ?? 0;

  const stageLabel = useMemo(
    () => (stage === 1 ? "Interval calculator" : "Barcode generator"),
    [stage]
  );

  return (
    <div className="app-shell">
      <header className="app-header">
        <div>
          <p className="app-kicker">Clinical tool</p>
          <h1 className="app-title">Injection Calculator</h1>
          <p className="app-desc">{stageLabel}</p>
        </div>
        <div className="stage-pills">
          <span className={stage === 1 ? "pill pill-on" : "pill"}>1</span>
          <span className="pill-line" />
          <span className={stage === 2 ? "pill pill-on" : "pill"}>2</span>
        </div>
      </header>

      <main>
        {stage === 1 ? (
          <Stage1
            state={stage1}
            activeField={
              activeField === "recentInjection" ? "lastInjection" : activeField
            }
            digitBuffer={digitBuffer}
            onSelectField={onSelectField}
            onDigit={onDigit}
            onClear={onClear}
            onBackspace={onBackspace}
            onToday={onToday}
            onKeep={() => applyAdjustment("keep")}
            onExtend={() => applyAdjustment("extend")}
            onShorten={() => applyAdjustment("shorten")}
            onContinue={() => {
              setStage(2);
              setActiveField("recentInjection");
              setDigitBuffer("");
            }}
          />
        ) : (
          <Stage2
            nextInjectionWeeks={nextWeeks}
            state={stage2}
            activeField={activeField}
            digitBuffer={digitBuffer}
            onSelectField={onSelectField}
            onDigit={onDigit}
            onClear={onClear}
            onBackspace={onBackspace}
            onToday={onToday}
            onSetEye={(eye: Eye) => setStage2((p) => ({ ...p, eye }))}
            onSetDiagnosis={(diagnosis: Diagnosis) =>
              setStage2((p) => ({ ...p, diagnosis }))
            }
            onSetOnlyEye={(onlyEye: OnlyEye) =>
              setStage2((p) => ({ ...p, onlyEye }))
            }
            onSetDrug={(drug: Drug) => setStage2((p) => ({ ...p, drug }))}
            onToggleFu={() =>
              setStage2((p) => ({ ...p, fuOctBefore: !p.fuOctBefore }))
            }
            onBack={() => {
              setStage(1);
              setActiveField("lastInjection");
              setDigitBuffer("");
            }}
          />
        )}
      </main>

      <footer className="app-footer">
        Dates: type DDMM (year {YEAR_HINT}) or full DDMMYYYY · Q-week adjusts
        by weeks from today to recent injection
      </footer>
    </div>
  );
}

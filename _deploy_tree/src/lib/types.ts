export type Eye = "RE" | "LE";
export type Diagnosis = "wAMD" | "PCV";
export type Drug = "Eylea 8mg" | "Eylea 2mg" | "Vabysmo" | "Lucentis";
export type OnlyEye = "RE only eye" | "LE only eye" | null;
export type DateField = "lastInjection" | "octM" | "recentInjection";
export type Stage = 1 | 2;

export interface Stage1State {
  lastInjection: string; // YYYY-MM-DD or empty
  octM: string;
  noOfWeeks: number | null;
  nextInjectionWeeks: number | null;
  adjustment: "keep" | "extend" | "shorten" | null;
}

export interface Stage2State {
  recentInjection: string;
  eye: Eye | null;
  diagnosis: Diagnosis | null;
  onlyEye: OnlyEye;
  drug: Drug | null;
  fuOctBefore: boolean;
}

export interface AppState {
  stage: Stage;
  stage1: Stage1State;
  stage2: Stage2State;
  activeField: DateField;
  digitBuffer: string;
}

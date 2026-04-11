export interface PartialDerivative {
  variable: string;
  expression: string;
  latex: string;
}

export interface CriticalPoint {
  x: number;
  y: number;
  z?: number;
  fValue: number;
  type: "minimum" | "maximum" | "saddle" | "inconclusive";
  hessianDeterminant: number;
  fxx: number;
}

export interface HessianMatrix {
  matrix: number[][];
  fxx: string;
  fxy: string;
  fyx: string;
  fyy: string;
  fxxLatex: string;
  fxyLatex: string;
  fyxLatex: string;
  fyyLatex: string;
}

export interface AnalysisStep {
  title: string;
  content: string;
  latex?: string;
  type: "info" | "calculation" | "result" | "warning";
}

export interface SurfaceData {
  x: number[];
  y: number[];
  z: number[][];
  criticalPoints: {
    x: number;
    y: number;
    z: number;
    type: string;
  }[];
}

export interface ContourData {
  x: number[];
  y: number[];
  z: number[][];
  levels: number[];
}

export interface AnalysisResult {
  originalFunction: string;
  functionLatex: string;
  variables: string[];
  partialDerivatives: PartialDerivative[];
  criticalPoints: CriticalPoint[];
  hessian: HessianMatrix | null;
  steps: AnalysisStep[];
  surfaceData: SurfaceData | null;
  contourData: ContourData | null;
  error?: string;
}

export interface HistoryEntry {
  id: string;
  function: string;
  timestamp: Date;
  criticalPointsCount: number;
}

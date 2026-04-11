import * as math from "mathjs";

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

// Helper to convert math.js expression to LaTeX
function toLatex(expr: math.MathNode): string {
  try {
    return expr.toTex({ parenthesis: "auto" });
  } catch {
    return expr.toString();
  }
}

// Parse and validate the function
export function parseFunction(funcStr: string): {
  node: math.MathNode;
  variables: string[];
  error?: string;
} {
  try {
    // Clean the input
    const cleaned = funcStr
      .replace(/\^/g, "^")
      .replace(/×/g, "*")
      .replace(/÷/g, "/")
      .replace(/−/g, "-");

    const node = math.parse(cleaned);

    // Extract variables (filter out known functions)
    const knownFunctions = new Set([
      "sin",
      "cos",
      "tan",
      "exp",
      "log",
      "ln",
      "sqrt",
      "abs",
      "asin",
      "acos",
      "atan",
      "sinh",
      "cosh",
      "tanh",
      "sec",
      "csc",
      "cot",
      "pi",
      "e",
    ]);

    const variables = new Set<string>();
    node.traverse((n) => {
      if (n.type === "SymbolNode" && !knownFunctions.has(n.name as string)) {
        variables.add((n as math.SymbolNode).name);
      }
    });

    const sortedVars = Array.from(variables).sort();

    if (sortedVars.length === 0) {
      return { node, variables: [], error: "No variables found in function" };
    }

    if (sortedVars.length > 3) {
      return {
        node,
        variables: sortedVars,
        error: "Maximum 3 variables supported",
      };
    }

    return { node, variables: sortedVars };
  } catch (e) {
    return {
      node: math.parse("0"),
      variables: [],
      error: `Invalid function: ${e instanceof Error ? e.message : "Unknown error"}`,
    };
  }
}

// Compute partial derivative
export function computePartialDerivative(
  node: math.MathNode,
  variable: string
): { expression: math.MathNode; latex: string } {
  try {
    const derivative = math.derivative(node, variable);
    const simplified = math.simplify(derivative);
    return {
      expression: simplified,
      latex: toLatex(simplified),
    };
  } catch {
    return {
      expression: math.parse("0"),
      latex: "0",
    };
  }
}

// Solve system of equations for critical points
export function findCriticalPoints(
  node: math.MathNode,
  derivatives: { variable: string; expression: math.MathNode }[],
  variables: string[]
): CriticalPoint[] {
  const criticalPoints: CriticalPoint[] = [];

  // For 2D functions, we'll use numerical search
  if (variables.length === 2) {
    const [varX, varY] = variables;

    // Create compiled functions
    const dfdx = derivatives.find((d) => d.variable === varX)?.expression;
    const dfdy = derivatives.find((d) => d.variable === varY)?.expression;

    if (!dfdx || !dfdy) return [];

    const compiledDfdx = dfdx.compile();
    const compiledDfdy = dfdy.compile();
    const compiledF = node.compile();

    // Compute second derivatives
    const d2fdx2 = math.simplify(math.derivative(dfdx, varX));
    const d2fdy2 = math.simplify(math.derivative(dfdy, varY));
    const d2fdxdy = math.simplify(math.derivative(dfdx, varY));

    const compiledFxx = d2fdx2.compile();
    const compiledFyy = d2fdy2.compile();
    const compiledFxy = d2fdxdy.compile();

    // Grid search for critical points
    const searchRange = 5;
    const step = 0.5;
    const tolerance = 0.01;
    const foundPoints: { x: number; y: number }[] = [];

    for (let x = -searchRange; x <= searchRange; x += step) {
      for (let y = -searchRange; y <= searchRange; y += step) {
        try {
          // Newton-Raphson iteration
          let px = x;
          let py = y;

          for (let iter = 0; iter < 20; iter++) {
            const scope = { [varX]: px, [varY]: py };
            const fx = compiledDfdx.evaluate(scope) as number;
            const fy = compiledDfdy.evaluate(scope) as number;

            if (Math.abs(fx) < tolerance && Math.abs(fy) < tolerance) {
              // Check if this point is already found
              const isDuplicate = foundPoints.some(
                (p) => Math.abs(p.x - px) < 0.1 && Math.abs(p.y - py) < 0.1
              );

              if (
                !isDuplicate &&
                isFinite(px) &&
                isFinite(py) &&
                Math.abs(px) < 100 &&
                Math.abs(py) < 100
              ) {
                foundPoints.push({ x: px, y: py });
              }
              break;
            }

            // Compute Jacobian
            const fxx = compiledFxx.evaluate(scope) as number;
            const fyy = compiledFyy.evaluate(scope) as number;
            const fxy = compiledFxy.evaluate(scope) as number;

            const det = fxx * fyy - fxy * fxy;
            if (Math.abs(det) < 1e-10) break;

            // Newton step
            px -= (fyy * fx - fxy * fy) / det;
            py -= (fxx * fy - fxy * fx) / det;

            if (!isFinite(px) || !isFinite(py)) break;
          }
        } catch {
          // Skip invalid evaluations
        }
      }
    }

    // Classify each critical point
    for (const point of foundPoints) {
      try {
        const scope = { [varX]: point.x, [varY]: point.y };

        const fxx = compiledFxx.evaluate(scope) as number;
        const fyy = compiledFyy.evaluate(scope) as number;
        const fxy = compiledFxy.evaluate(scope) as number;
        const fValue = compiledF.evaluate(scope) as number;

        const D = fxx * fyy - fxy * fxy;

        let type: CriticalPoint["type"];
        if (Math.abs(D) < 1e-10) {
          type = "inconclusive";
        } else if (D > 0) {
          type = fxx > 0 ? "minimum" : "maximum";
        } else {
          type = "saddle";
        }

        criticalPoints.push({
          x: Math.round(point.x * 1000) / 1000,
          y: Math.round(point.y * 1000) / 1000,
          fValue: Math.round(fValue * 1000) / 1000,
          type,
          hessianDeterminant: Math.round(D * 1000) / 1000,
          fxx: Math.round(fxx * 1000) / 1000,
        });
      } catch {
        // Skip invalid points
      }
    }
  }

  return criticalPoints;
}

// Compute Hessian matrix
export function computeHessian(
  node: math.MathNode,
  variables: string[]
): HessianMatrix | null {
  if (variables.length !== 2) return null;

  const [x, y] = variables;

  try {
    const fx = math.derivative(node, x);
    const fy = math.derivative(node, y);

    const fxx = math.simplify(math.derivative(fx, x));
    const fxy = math.simplify(math.derivative(fx, y));
    const fyx = math.simplify(math.derivative(fy, x));
    const fyy = math.simplify(math.derivative(fy, y));

    return {
      matrix: [], // Will be filled at evaluation points
      fxx: fxx.toString(),
      fxy: fxy.toString(),
      fyx: fyx.toString(),
      fyy: fyy.toString(),
      fxxLatex: toLatex(fxx),
      fxyLatex: toLatex(fxy),
      fyxLatex: toLatex(fyx),
      fyyLatex: toLatex(fyy),
    };
  } catch {
    return null;
  }
}

// Generate surface data for 3D plot
export function generateSurfaceData(
  node: math.MathNode,
  variables: string[],
  criticalPoints: CriticalPoint[],
  range: number = 5,
  resolution: number = 50
): SurfaceData | null {
  if (variables.length !== 2) return null;

  const [varX, varY] = variables;
  const compiled = node.compile();

  const x: number[] = [];
  const y: number[] = [];
  const z: number[][] = [];

  const step = (2 * range) / resolution;

  for (let i = 0; i <= resolution; i++) {
    x.push(-range + i * step);
    y.push(-range + i * step);
  }

  for (let i = 0; i <= resolution; i++) {
    const row: number[] = [];
    for (let j = 0; j <= resolution; j++) {
      try {
        const value = compiled.evaluate({
          [varX]: x[j],
          [varY]: y[i],
        }) as number;
        row.push(isFinite(value) ? value : NaN);
      } catch {
        row.push(NaN);
      }
    }
    z.push(row);
  }

  return {
    x,
    y,
    z,
    criticalPoints: criticalPoints.map((cp) => ({
      x: cp.x,
      y: cp.y,
      z: cp.fValue,
      type: cp.type,
    })),
  };
}

// Generate contour data
export function generateContourData(
  node: math.MathNode,
  variables: string[],
  range: number = 5,
  resolution: number = 100
): ContourData | null {
  if (variables.length !== 2) return null;

  const [varX, varY] = variables;
  const compiled = node.compile();

  const x: number[] = [];
  const y: number[] = [];
  const z: number[][] = [];

  const step = (2 * range) / resolution;

  for (let i = 0; i <= resolution; i++) {
    x.push(-range + i * step);
    y.push(-range + i * step);
  }

  let minZ = Infinity;
  let maxZ = -Infinity;

  for (let i = 0; i <= resolution; i++) {
    const row: number[] = [];
    for (let j = 0; j <= resolution; j++) {
      try {
        const value = compiled.evaluate({
          [varX]: x[j],
          [varY]: y[i],
        }) as number;
        if (isFinite(value)) {
          row.push(value);
          minZ = Math.min(minZ, value);
          maxZ = Math.max(maxZ, value);
        } else {
          row.push(NaN);
        }
      } catch {
        row.push(NaN);
      }
    }
    z.push(row);
  }

  // Generate level curves
  const numLevels = 15;
  const levels: number[] = [];
  const levelStep = (maxZ - minZ) / numLevels;
  for (let i = 0; i <= numLevels; i++) {
    levels.push(minZ + i * levelStep);
  }

  return { x, y, z, levels };
}

// Generate step-by-step explanation
export function generateExplanation(
  funcStr: string,
  node: math.MathNode,
  variables: string[],
  partialDerivatives: PartialDerivative[],
  criticalPoints: CriticalPoint[],
  hessian: HessianMatrix | null
): AnalysisStep[] {
  const steps: AnalysisStep[] = [];

  // Step 1: Introduction
  steps.push({
    title: "Understanding the Function",
    content: `We are analyzing the function f(${variables.join(", ")}) = ${funcStr}. This is a ${variables.length === 2 ? "two" : "three"}-variable function, and we'll find its critical points and classify them.`,
    latex: `f(${variables.join(", ")}) = ${toLatex(node)}`,
    type: "info",
  });

  // Step 2: Partial Derivatives
  steps.push({
    title: "Computing Partial Derivatives",
    content: `To find critical points, we first compute the partial derivatives with respect to each variable. A critical point occurs where all partial derivatives equal zero simultaneously.`,
    type: "info",
  });

  for (const pd of partialDerivatives) {
    steps.push({
      title: `Partial Derivative with respect to ${pd.variable}`,
      content: `We differentiate f with respect to ${pd.variable}, treating other variables as constants.`,
      latex: `\\frac{\\partial f}{\\partial ${pd.variable}} = ${pd.latex}`,
      type: "calculation",
    });
  }

  // Step 3: Setting up the system
  steps.push({
    title: "Setting Up the System of Equations",
    content: `To find critical points, we set each partial derivative equal to zero and solve the resulting system:`,
    latex: partialDerivatives
      .map((pd) => `\\frac{\\partial f}{\\partial ${pd.variable}} = 0`)
      .join(" \\quad \\text{and} \\quad "),
    type: "calculation",
  });

  // Step 4: Critical Points
  if (criticalPoints.length === 0) {
    steps.push({
      title: "Critical Points",
      content:
        "No critical points were found in the search region. This could mean the function has no critical points, or they exist outside the analyzed domain.",
      type: "warning",
    });
  } else {
    steps.push({
      title: "Critical Points Found",
      content: `We found ${criticalPoints.length} critical point(s) by solving the system of equations.`,
      type: "result",
    });

    for (let i = 0; i < criticalPoints.length; i++) {
      const cp = criticalPoints[i];
      steps.push({
        title: `Critical Point ${i + 1}`,
        content: `Located at (${cp.x}, ${cp.y}) with function value f = ${cp.fValue}`,
        latex: `P_{${i + 1}} = (${cp.x}, ${cp.y}), \\quad f(P_{${i + 1}}) = ${cp.fValue}`,
        type: "result",
      });
    }
  }

  // Step 5: Hessian Matrix
  if (hessian && variables.length === 2) {
    steps.push({
      title: "The Hessian Matrix",
      content: `The Hessian matrix H contains all second partial derivatives. It's used to classify critical points using the second derivative test.`,
      latex: `H = \\begin{bmatrix} f_{xx} & f_{xy} \\\\ f_{yx} & f_{yy} \\end{bmatrix} = \\begin{bmatrix} ${hessian.fxxLatex} & ${hessian.fxyLatex} \\\\ ${hessian.fyxLatex} & ${hessian.fyyLatex} \\end{bmatrix}`,
      type: "calculation",
    });

    steps.push({
      title: "Second Derivative Test",
      content: `We compute the determinant D = fxx * fyy - (fxy)^2 at each critical point. The classification rules are:
      
      - If D > 0 and fxx > 0: Local Minimum
      - If D > 0 and fxx < 0: Local Maximum  
      - If D < 0: Saddle Point
      - If D = 0: Test is Inconclusive`,
      type: "info",
    });
  }

  // Step 6: Classification
  for (let i = 0; i < criticalPoints.length; i++) {
    const cp = criticalPoints[i];
    let explanation = "";

    switch (cp.type) {
      case "minimum":
        explanation = `D = ${cp.hessianDeterminant} > 0 and fxx = ${cp.fxx} > 0, so this is a LOCAL MINIMUM. The surface curves upward in all directions from this point.`;
        break;
      case "maximum":
        explanation = `D = ${cp.hessianDeterminant} > 0 and fxx = ${cp.fxx} < 0, so this is a LOCAL MAXIMUM. The surface curves downward in all directions from this point.`;
        break;
      case "saddle":
        explanation = `D = ${cp.hessianDeterminant} < 0, so this is a SADDLE POINT. The surface curves up in some directions and down in others - like a mountain pass or horse saddle.`;
        break;
      case "inconclusive":
        explanation = `D = ${cp.hessianDeterminant} = 0, so the second derivative test is INCONCLUSIVE. Higher-order analysis would be needed.`;
        break;
    }

    steps.push({
      title: `Classification of Point ${i + 1}: (${cp.x}, ${cp.y})`,
      content: explanation,
      latex: `D = f_{xx} \\cdot f_{yy} - (f_{xy})^2 = ${cp.hessianDeterminant}`,
      type: cp.type === "saddle" ? "warning" : "result",
    });
  }

  // Summary
  const minCount = criticalPoints.filter((cp) => cp.type === "minimum").length;
  const maxCount = criticalPoints.filter((cp) => cp.type === "maximum").length;
  const saddleCount = criticalPoints.filter(
    (cp) => cp.type === "saddle"
  ).length;

  steps.push({
    title: "Summary",
    content: `Analysis complete! Found ${criticalPoints.length} critical point(s): ${minCount} local minimum(s), ${maxCount} local maximum(s), and ${saddleCount} saddle point(s).`,
    type: "info",
  });

  return steps;
}

// Main analysis function
export function analyzeFunction(funcStr: string): AnalysisResult {
  // Parse the function
  const { node, variables, error: parseError } = parseFunction(funcStr);

  if (parseError) {
    return {
      originalFunction: funcStr,
      functionLatex: funcStr,
      variables: [],
      partialDerivatives: [],
      criticalPoints: [],
      hessian: null,
      steps: [],
      surfaceData: null,
      contourData: null,
      error: parseError,
    };
  }

  // Compute partial derivatives
  const partialDerivatives: PartialDerivative[] = [];
  const derivativeNodes: { variable: string; expression: math.MathNode }[] = [];

  for (const variable of variables) {
    const { expression, latex } = computePartialDerivative(node, variable);
    partialDerivatives.push({
      variable,
      expression: expression.toString(),
      latex,
    });
    derivativeNodes.push({ variable, expression });
  }

  // Find critical points
  const criticalPoints = findCriticalPoints(node, derivativeNodes, variables);

  // Compute Hessian
  const hessian = computeHessian(node, variables);

  // Generate surface and contour data
  const surfaceData = generateSurfaceData(node, variables, criticalPoints);
  const contourData = generateContourData(node, variables);

  // Generate explanation
  const steps = generateExplanation(
    funcStr,
    node,
    variables,
    partialDerivatives,
    criticalPoints,
    hessian
  );

  return {
    originalFunction: funcStr,
    functionLatex: toLatex(node),
    variables,
    partialDerivatives,
    criticalPoints,
    hessian,
    steps,
    surfaceData,
    contourData,
  };
}

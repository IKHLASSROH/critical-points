import { NextRequest, NextResponse } from "next/server";
import { create, all, MathNode, SymbolNode } from "mathjs";

const math = create(all);

// Supported variables for multi-variable analysis
const SUPPORTED_VARIABLES = ["x", "y", "z", "t", "u", "v", "w"];
const MATH_CONSTANTS = ["e", "pi", "i"];

interface CriticalPoint {
  x: number;
  y: number;
  type: "local-minimum" | "local-maximum" | "inflection" | "saddle";
  explanation: string;
}

interface PartialDerivative {
  variable: string;
  first: string;
  second: string;
}

interface AnalysisResult {
  originalFunction: string;
  variables: string[];
  // Single variable mode
  firstDerivative: string;
  secondDerivative: string;
  criticalPoints: CriticalPoint[];
  inflectionPoints: { x: number; y: number; explanation: string }[];
  intervals: {
    increasing: string[];
    decreasing: string[];
    concaveUp: string[];
    concaveDown: string[];
  };
  tableOfValues: { x: number; y: number }[];
  // Multi-variable mode
  partialDerivatives: PartialDerivative[];
  gradient: string;
  hessianMatrix: string[][];
  mixedPartials: { variables: string; derivative: string }[];
  steps: string[];
}

// Safe evaluation with error handling
function safeEvaluate(expr: string, x: number): number | null {
  try {
    const result = math.evaluate(expr, { x });
    if (typeof result === "number" && isFinite(result) && !isNaN(result)) {
      return result;
    }
    return null;
  } catch {
    return null;
  }
}

// Find roots of an expression numerically using Newton-Raphson
function findRoots(
  expr: string,
  derivative: string,
  range: [number, number] = [-10, 10],
  tolerance: number = 1e-8
): number[] {
  const roots: number[] = [];
  const step = 0.5;

  for (let x0 = range[0]; x0 <= range[1]; x0 += step) {
    let x = x0;
    let iterations = 0;
    const maxIterations = 50;

    while (iterations < maxIterations) {
      const fx = safeEvaluate(expr, x);
      const fpx = safeEvaluate(derivative, x);

      if (fx === null || fpx === null || Math.abs(fpx) < 1e-12) break;

      const xNew = x - fx / fpx;
      if (Math.abs(xNew - x) < tolerance) {
        // Check if this root is already found
        const isDuplicate = roots.some((r) => Math.abs(r - xNew) < 0.01);
        if (!isDuplicate && xNew >= range[0] && xNew <= range[1]) {
          // Verify it's actually a root
          const verify = safeEvaluate(expr, xNew);
          if (verify !== null && Math.abs(verify) < 0.001) {
            roots.push(Math.round(xNew * 1000) / 1000);
          }
        }
        break;
      }
      x = xNew;
      iterations++;
    }
  }

  return roots.sort((a, b) => a - b);
}

// Format expression for display
function formatExpression(expr: string): string {
  return expr
    .replace(/\*/g, " * ")
    .replace(/\+/g, " + ")
    .replace(/-/g, " - ")
    .replace(/\s+/g, " ")
    .replace(/\^\s*/g, "^")
    .trim()
    .replace(/^\s*-\s*/, "-");
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { functionInput } = body;

    if (!functionInput || typeof functionInput !== "string") {
      return NextResponse.json(
        { error: "Please provide a valid function" },
        { status: 400 }
      );
    }

    // Sanitize and parse the function
    const sanitized = functionInput
      .toLowerCase()
      .replace(/\s+/g, "")
      .replace(/\^/g, "^")
      .replace(/(\d)([a-z])/g, "$1*$2") // 2x -> 2*x
      .replace(/([a-z])(\d)/g, "$1^$2") // x2 -> x^2 (but be careful)
      .replace(/\)\(/g, ")*(") // )(  -> )*(
      .replace(/(\d)\(/g, "$1*("); // 2( -> 2*(

    let parsed: MathNode;
    try {
      parsed = math.parse(sanitized);
    } catch {
      return NextResponse.json(
        { error: "Could not parse the function. Please check the syntax." },
        { status: 400 }
      );
    }

    // Detect all variables used in the function
    const allSymbols = parsed
      .filter((node): node is SymbolNode => node.isSymbolNode)
      .map((node) => node.name);
    
    const detectedVariables = [...new Set(allSymbols)]
      .filter((name) => !MATH_CONSTANTS.includes(name))
      .filter((name) => !(name in math))
      .filter((name) => SUPPORTED_VARIABLES.includes(name))
      .sort();

    const unknownVariables = [...new Set(allSymbols)]
      .filter((name) => !MATH_CONSTANTS.includes(name))
      .filter((name) => !(name in math))
      .filter((name) => !SUPPORTED_VARIABLES.includes(name));

    if (unknownVariables.length > 0) {
      return NextResponse.json(
        { error: `Unknown variable(s): ${unknownVariables.join(", ")}. Supported: ${SUPPORTED_VARIABLES.join(", ")}` },
        { status: 400 }
      );
    }

    // Use 'x' as default if no variables detected (constant function)
    const variables = detectedVariables.length > 0 ? detectedVariables : ["x"];
    const isMultiVariable = variables.length > 1;
    const primaryVariable = variables[0];

    const steps: string[] = [];
    const partialDerivatives: PartialDerivative[] = [];
    const mixedPartials: { variables: string; derivative: string }[] = [];

    // Step 1: Parse and display original function
    if (isMultiVariable) {
      steps.push(`Step 1: Identify the function f(${variables.join(", ")}) = ${functionInput}`);
      steps.push(`Detected ${variables.length} variables: ${variables.join(", ")}`);
    } else {
      steps.push(`Step 1: Identify the function f(${primaryVariable}) = ${functionInput}`);
    }

    // Step 2: Compute derivatives (partial for multi-variable)
    let firstDerivative: MathNode;
    let firstDerivativeStr: string;
    let secondDerivative: MathNode;
    let secondDerivativeStr: string;

    if (isMultiVariable) {
      // Multi-variable: compute partial derivatives for each variable
      steps.push(`Step 2: Compute partial derivatives for each variable`);
      
      for (const variable of variables) {
        try {
          const partial1 = math.derivative(parsed, variable);
          const partial1Str = partial1.toString();
          
          let partial2Str = "0";
          try {
            const partial2 = math.derivative(partial1, variable);
            partial2Str = partial2.toString();
          } catch {
            // Second derivative might not exist
          }
          
          partialDerivatives.push({
            variable,
            first: formatExpression(partial1Str),
            second: formatExpression(partial2Str),
          });
          
          steps.push(`Partial derivative with respect to ${variable}:`);
          steps.push(`  df/d${variable} = ${formatExpression(partial1Str)}`);
          steps.push(`  d²f/d${variable}² = ${formatExpression(partial2Str)}`);
        } catch {
          partialDerivatives.push({
            variable,
            first: "Could not compute",
            second: "Could not compute",
          });
        }
      }

      // Compute mixed partial derivatives
      steps.push(`Step 3: Compute mixed partial derivatives`);
      for (let i = 0; i < variables.length; i++) {
        for (let j = i + 1; j < variables.length; j++) {
          try {
            const partial1 = math.derivative(parsed, variables[i]);
            const mixedPartial = math.derivative(partial1, variables[j]);
            const mixedStr = formatExpression(mixedPartial.toString());
            mixedPartials.push({
              variables: `d²f/d${variables[i]}d${variables[j]}`,
              derivative: mixedStr,
            });
            steps.push(`  d²f/d${variables[i]}d${variables[j]} = ${mixedStr}`);
          } catch {
            mixedPartials.push({
              variables: `d²f/d${variables[i]}d${variables[j]}`,
              derivative: "Could not compute",
            });
          }
        }
      }

      // Use first variable for single-variable compatible fields
      firstDerivativeStr = partialDerivatives[0]?.first || "0";
      secondDerivativeStr = partialDerivatives[0]?.second || "0";
      try {
        firstDerivative = math.parse(firstDerivativeStr);
        secondDerivative = math.parse(secondDerivativeStr);
      } catch {
        firstDerivative = math.parse("0");
        secondDerivative = math.parse("0");
      }
    } else {
      // Single variable: standard derivatives
      try {
        firstDerivative = math.derivative(parsed, primaryVariable);
        firstDerivativeStr = firstDerivative.toString();
        steps.push(
          `Step 2: Find the first derivative using differentiation rules`
        );
        steps.push(`f'(${primaryVariable}) = ${formatExpression(firstDerivativeStr)}`);
        
        partialDerivatives.push({
          variable: primaryVariable,
          first: formatExpression(firstDerivativeStr),
          second: "",
        });
      } catch {
        return NextResponse.json(
          { error: "Could not compute the derivative of this function." },
          { status: 400 }
        );
      }

      // Step 3: Compute second derivative
      try {
        secondDerivative = math.derivative(firstDerivative, primaryVariable);
        secondDerivativeStr = secondDerivative.toString();
        steps.push(`Step 3: Find the second derivative`);
        steps.push(`f''(${primaryVariable}) = ${formatExpression(secondDerivativeStr)}`);
        
        partialDerivatives[0].second = formatExpression(secondDerivativeStr);
      } catch {
        secondDerivativeStr = "0";
        secondDerivative = math.parse("0");
        steps.push(`Step 3: Second derivative is constant: f''(${primaryVariable}) = 0`);
        partialDerivatives[0].second = "0";
      }
    }

    // Step 4: Find critical points (single variable only for now)
    let criticalXValues: number[] = [];
    
    if (!isMultiVariable) {
      steps.push(
        `Step 4: Find critical points by solving f'(${primaryVariable}) = 0`
      );

      // Compute derivative of first derivative for Newton-Raphson
      let firstDerivativeOfFirst: string;
      try {
        firstDerivativeOfFirst = math.derivative(firstDerivative, primaryVariable).toString();
      } catch {
        firstDerivativeOfFirst = "1";
      }

      criticalXValues = findRoots(
        firstDerivativeStr,
        firstDerivativeOfFirst
      );
    } else {
      steps.push(`Step 4: For multi-variable functions, critical points require solving a system of equations`);
      steps.push(`Set all partial derivatives equal to zero simultaneously`);
      for (const pd of partialDerivatives) {
        steps.push(`  df/d${pd.variable} = ${pd.first} = 0`);
      }
    }

    if (!isMultiVariable) {
      if (criticalXValues.length === 0) {
        steps.push(`No critical points found in the range [-10, 10]`);
      } else {
        steps.push(`Critical points found at ${primaryVariable} = ${criticalXValues.join(", ")}`);
      }

      // Step 5: Classify critical points using second derivative test
      steps.push(`Step 5: Classify critical points using the second derivative test`);
      steps.push(`If f''(${primaryVariable}) > 0, the point is a local minimum`);
      steps.push(`If f''(${primaryVariable}) < 0, the point is a local maximum`);
      steps.push(`If f''(${primaryVariable}) = 0, the test is inconclusive`);
    } else {
      steps.push(`Step 5: For multi-variable functions, use the Hessian matrix to classify critical points`);
      steps.push(`The Hessian matrix H contains all second-order partial derivatives`);
    }

    const criticalPoints: CriticalPoint[] = [];
    for (const x of criticalXValues) {
      const y = safeEvaluate(sanitized, x);
      const secondDerivValue = safeEvaluate(secondDerivativeStr, x);

      if (y === null) continue;

      let type: CriticalPoint["type"] = "saddle";
      let explanation = "";

      if (secondDerivValue !== null) {
        if (secondDerivValue > 0.001) {
          type = "local-minimum";
          explanation = `At x = ${x}, f''(${x}) = ${secondDerivValue.toFixed(4)} > 0, so this is a local minimum`;
        } else if (secondDerivValue < -0.001) {
          type = "local-maximum";
          explanation = `At x = ${x}, f''(${x}) = ${secondDerivValue.toFixed(4)} < 0, so this is a local maximum`;
        } else {
          type = "saddle";
          explanation = `At x = ${x}, f''(${x}) ≈ 0, the second derivative test is inconclusive`;
        }
      }

      criticalPoints.push({
        x: Math.round(x * 1000) / 1000,
        y: Math.round(y * 1000) / 1000,
        type,
        explanation,
      });

      steps.push(explanation);
    }

    // Step 6: Find inflection points (where f''(x) = 0)
    steps.push(`Step 6: Find inflection points by solving f''(x) = 0`);

    let secondDerivativeOfSecond: string;
    try {
      secondDerivativeOfSecond = math
        .derivative(secondDerivative, "x")
        .toString();
    } catch {
      secondDerivativeOfSecond = "1";
    }

    const inflectionXValues = findRoots(
      secondDerivativeStr,
      secondDerivativeOfSecond
    );

    const inflectionPoints: { x: number; y: number; explanation: string }[] =
      [];
    for (const x of inflectionXValues) {
      const y = safeEvaluate(sanitized, x);
      if (y !== null) {
        inflectionPoints.push({
          x: Math.round(x * 1000) / 1000,
          y: Math.round(y * 1000) / 1000,
          explanation: `At x = ${x}, f''(x) = 0 and the concavity changes, so this is an inflection point`,
        });
        steps.push(
          `Inflection point found at (${x.toFixed(3)}, ${y.toFixed(3)})`
        );
      }
    }

    if (inflectionPoints.length === 0) {
      steps.push(`No inflection points found in the range [-10, 10]`);
    }

    // Step 7: Determine intervals
    steps.push(`Step 7: Determine intervals of increase/decrease and concavity`);

    const allCriticalX = [...criticalXValues, -10, 10].sort((a, b) => a - b);
    const allInflectionX = [...inflectionXValues, -10, 10].sort(
      (a, b) => a - b
    );

    const increasing: string[] = [];
    const decreasing: string[] = [];
    const concaveUp: string[] = [];
    const concaveDown: string[] = [];

    // Check intervals for increasing/decreasing
    for (let i = 0; i < allCriticalX.length - 1; i++) {
      const left = allCriticalX[i];
      const right = allCriticalX[i + 1];
      const mid = (left + right) / 2;
      const fPrimeMid = safeEvaluate(firstDerivativeStr, mid);

      if (fPrimeMid !== null) {
        if (fPrimeMid > 0) {
          increasing.push(`(${left.toFixed(2)}, ${right.toFixed(2)})`);
        } else if (fPrimeMid < 0) {
          decreasing.push(`(${left.toFixed(2)}, ${right.toFixed(2)})`);
        }
      }
    }

    // Check intervals for concavity
    for (let i = 0; i < allInflectionX.length - 1; i++) {
      const left = allInflectionX[i];
      const right = allInflectionX[i + 1];
      const mid = (left + right) / 2;
      const fDoublePrimeMid = safeEvaluate(secondDerivativeStr, mid);

      if (fDoublePrimeMid !== null) {
        if (fDoublePrimeMid > 0) {
          concaveUp.push(`(${left.toFixed(2)}, ${right.toFixed(2)})`);
        } else if (fDoublePrimeMid < 0) {
          concaveDown.push(`(${left.toFixed(2)}, ${right.toFixed(2)})`);
        }
      }
    }

    if (increasing.length > 0) {
      steps.push(`Function is increasing on: ${increasing.join(", ")}`);
    }
    if (decreasing.length > 0) {
      steps.push(`Function is decreasing on: ${decreasing.join(", ")}`);
    }
    if (concaveUp.length > 0) {
      steps.push(`Function is concave up on: ${concaveUp.join(", ")}`);
    }
    if (concaveDown.length > 0) {
      steps.push(`Function is concave down on: ${concaveDown.join(", ")}`);
    }

    // Generate table of values
    const tableOfValues: { x: number; y: number }[] = [];
    for (let x = -10; x <= 10; x += 0.25) {
      const y = safeEvaluate(sanitized, x);
      if (y !== null && Math.abs(y) < 1000) {
        tableOfValues.push({
          x: Math.round(x * 100) / 100,
          y: Math.round(y * 1000) / 1000,
        });
      }
    }

    // Build Hessian matrix for multi-variable functions
    const hessianMatrix: string[][] = [];
    if (isMultiVariable) {
      for (const var1 of variables) {
        const row: string[] = [];
        for (const var2 of variables) {
          try {
            const partial1 = math.derivative(parsed, var1);
            const partial2 = math.derivative(partial1, var2);
            row.push(formatExpression(partial2.toString()));
          } catch {
            row.push("0");
          }
        }
        hessianMatrix.push(row);
      }
    }

    // Build gradient string
    const gradient = isMultiVariable
      ? `(${partialDerivatives.map((pd) => pd.first).join(", ")})`
      : `(${formatExpression(firstDerivativeStr)})`;

    const result: AnalysisResult = {
      originalFunction: functionInput,
      variables,
      firstDerivative: formatExpression(firstDerivativeStr),
      secondDerivative: formatExpression(secondDerivativeStr),
      criticalPoints,
      inflectionPoints,
      intervals: {
        increasing,
        decreasing,
        concaveUp,
        concaveDown,
      },
      tableOfValues,
      partialDerivatives,
      gradient,
      hessianMatrix,
      mixedPartials,
      steps,
    };

    return NextResponse.json(result);
  } catch (error) {
    console.error("Analysis error:", error);
    return NextResponse.json(
      { error: "An error occurred while analyzing the function" },
      { status: 500 }
    );
  }
}

"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import type { AnalysisStep } from "@/lib/types";
import { Info, Calculator, CheckCircle, AlertTriangle } from "lucide-react";
import "katex/dist/katex.min.css";
import { BlockMath } from "react-katex";

interface ExplanationTabProps {
  steps: AnalysisStep[];
}

function getStepIcon(type: AnalysisStep["type"]) {
  switch (type) {
    case "info":
      return <Info className="h-5 w-5 text-primary" />;
    case "calculation":
      return <Calculator className="h-5 w-5 text-chart-4" />;
    case "result":
      return <CheckCircle className="h-5 w-5 text-chart-1" />;
    case "warning":
      return <AlertTriangle className="h-5 w-5 text-chart-3" />;
    default:
      return <Info className="h-5 w-5 text-muted-foreground" />;
  }
}

function getStepStyles(type: AnalysisStep["type"]) {
  switch (type) {
    case "info":
      return "border-l-primary bg-primary/5";
    case "calculation":
      return "border-l-chart-4 bg-chart-4/5";
    case "result":
      return "border-l-chart-1 bg-chart-1/5";
    case "warning":
      return "border-l-chart-3 bg-chart-3/5";
    default:
      return "border-l-muted bg-muted/50";
  }
}

export function ExplanationTab({ steps }: ExplanationTabProps) {
  if (steps.length === 0) {
    return (
      <Card>
        <CardContent className="py-12">
          <div className="text-center text-muted-foreground">
            <Info className="h-12 w-12 mx-auto mb-4 opacity-50" />
            <p>No analysis steps available</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="text-lg flex items-center gap-2">
            <Info className="h-5 w-5" />
            Step-by-Step Analysis
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground mb-6">
            This section walks you through the complete analysis process,
            explaining each step as a professor would in a multivariable calculus
            lecture.
          </p>

          <div className="space-y-4">
            {steps.map((step, index) => (
              <div
                key={index}
                className={`border-l-4 rounded-r-lg p-4 transition-all hover:shadow-md ${getStepStyles(step.type)}`}
              >
                <div className="flex items-start gap-3">
                  <div className="flex-shrink-0 mt-0.5">
                    {getStepIcon(step.type)}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-2">
                      <span className="text-xs font-medium px-2 py-0.5 rounded-full bg-background text-muted-foreground">
                        Step {index + 1}
                      </span>
                      <h3 className="font-semibold text-foreground">
                        {step.title}
                      </h3>
                    </div>
                    <p className="text-sm text-muted-foreground whitespace-pre-line mb-3">
                      {step.content}
                    </p>
                    {step.latex && (
                      <div className="bg-background/80 rounded-lg p-3 overflow-x-auto border">
                        <BlockMath math={step.latex} />
                      </div>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Key Concepts Review</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-2">
            <div className="p-4 rounded-lg border bg-card space-y-2">
              <h4 className="font-medium flex items-center gap-2">
                <Calculator className="h-4 w-4 text-primary" />
                Partial Derivatives
              </h4>
              <p className="text-sm text-muted-foreground">
                The rate of change of f with respect to one variable while
                holding others constant. Critical points occur where all partial
                derivatives equal zero.
              </p>
            </div>
            <div className="p-4 rounded-lg border bg-card space-y-2">
              <h4 className="font-medium flex items-center gap-2">
                <Calculator className="h-4 w-4 text-primary" />
                Hessian Matrix
              </h4>
              <p className="text-sm text-muted-foreground">
                A matrix of all second partial derivatives. Its determinant and
                eigenvalues determine the nature of critical points.
              </p>
            </div>
            <div className="p-4 rounded-lg border bg-card space-y-2">
              <h4 className="font-medium flex items-center gap-2">
                <CheckCircle className="h-4 w-4 text-chart-1" />
                Second Derivative Test
              </h4>
              <p className="text-sm text-muted-foreground">
                Uses D = fxx*fyy - (fxy)^2 to classify critical points. Positive
                D with positive fxx indicates minimum, negative D indicates
                saddle.
              </p>
            </div>
            <div className="p-4 rounded-lg border bg-card space-y-2">
              <h4 className="font-medium flex items-center gap-2">
                <AlertTriangle className="h-4 w-4 text-chart-3" />
                Saddle Points
              </h4>
              <p className="text-sm text-muted-foreground">
                Points where the surface curves up in some directions and down
                in others. They are neither maxima nor minima but are critical
                for optimization.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import type { PartialDerivative, HessianMatrix } from "@/lib/types";
import "katex/dist/katex.min.css";
import { InlineMath, BlockMath } from "react-katex";

interface DerivativesTabProps {
  functionLatex: string;
  partialDerivatives: PartialDerivative[];
  hessian: HessianMatrix | null;
}

export function DerivativesTab({
  functionLatex,
  partialDerivatives,
  hessian,
}: DerivativesTabProps) {
  return (
    <div className="grid gap-6">
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Original Function</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="p-4 bg-muted rounded-lg overflow-x-auto">
            <BlockMath math={`f(x, y) = ${functionLatex}`} />
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="text-lg">First Partial Derivatives</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-2">
            {partialDerivatives.map((pd) => (
              <div
                key={pd.variable}
                className="p-4 bg-muted rounded-lg space-y-2"
              >
                <p className="text-sm text-muted-foreground">
                  Derivative with respect to{" "}
                  <InlineMath math={pd.variable} />
                </p>
                <div className="overflow-x-auto">
                  <BlockMath
                    math={`\\frac{\\partial f}{\\partial ${pd.variable}} = ${pd.latex}`}
                  />
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {hessian && (
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Second Partial Derivatives</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid gap-4 md:grid-cols-2">
              <div className="p-4 bg-muted rounded-lg">
                <p className="text-sm text-muted-foreground mb-2">
                  <InlineMath math="f_{xx}" />
                </p>
                <div className="overflow-x-auto">
                  <BlockMath math={`f_{xx} = ${hessian.fxxLatex}`} />
                </div>
              </div>
              <div className="p-4 bg-muted rounded-lg">
                <p className="text-sm text-muted-foreground mb-2">
                  <InlineMath math="f_{xy}" />
                </p>
                <div className="overflow-x-auto">
                  <BlockMath math={`f_{xy} = ${hessian.fxyLatex}`} />
                </div>
              </div>
              <div className="p-4 bg-muted rounded-lg">
                <p className="text-sm text-muted-foreground mb-2">
                  <InlineMath math="f_{yx}" />
                </p>
                <div className="overflow-x-auto">
                  <BlockMath math={`f_{yx} = ${hessian.fyxLatex}`} />
                </div>
              </div>
              <div className="p-4 bg-muted rounded-lg">
                <p className="text-sm text-muted-foreground mb-2">
                  <InlineMath math="f_{yy}" />
                </p>
                <div className="overflow-x-auto">
                  <BlockMath math={`f_{yy} = ${hessian.fyyLatex}`} />
                </div>
              </div>
            </div>

            <div className="p-4 bg-secondary rounded-lg">
              <p className="text-sm font-medium mb-2">Hessian Matrix</p>
              <div className="overflow-x-auto">
                <BlockMath
                  math={`H = \\begin{bmatrix} f_{xx} & f_{xy} \\\\ f_{yx} & f_{yy} \\end{bmatrix} = \\begin{bmatrix} ${hessian.fxxLatex} & ${hessian.fxyLatex} \\\\ ${hessian.fyxLatex} & ${hessian.fyyLatex} \\end{bmatrix}`}
                />
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}

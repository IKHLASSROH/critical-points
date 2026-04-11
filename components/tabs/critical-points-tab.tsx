"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import type { CriticalPoint } from "@/lib/types";
import { TrendingDown, TrendingUp, AlertTriangle, HelpCircle } from "lucide-react";
import "katex/dist/katex.min.css";
import { InlineMath } from "react-katex";

interface CriticalPointsTabProps {
  criticalPoints: CriticalPoint[];
}

function getTypeIcon(type: CriticalPoint["type"]) {
  switch (type) {
    case "minimum":
      return <TrendingDown className="h-4 w-4" />;
    case "maximum":
      return <TrendingUp className="h-4 w-4" />;
    case "saddle":
      return <AlertTriangle className="h-4 w-4" />;
    default:
      return <HelpCircle className="h-4 w-4" />;
  }
}

function getTypeBadge(type: CriticalPoint["type"]) {
  const variants: Record<CriticalPoint["type"], { className: string; label: string }> = {
    minimum: {
      className: "bg-chart-1/20 text-chart-1 border-chart-1/30",
      label: "Local Minimum",
    },
    maximum: {
      className: "bg-chart-2/20 text-chart-2 border-chart-2/30",
      label: "Local Maximum",
    },
    saddle: {
      className: "bg-chart-3/20 text-chart-3 border-chart-3/30 animate-saddle",
      label: "Saddle Point",
    },
    inconclusive: {
      className: "bg-muted text-muted-foreground border-border",
      label: "Inconclusive",
    },
  };

  const variant = variants[type];
  return (
    <Badge variant="outline" className={`gap-1 ${variant.className}`}>
      {getTypeIcon(type)}
      {variant.label}
    </Badge>
  );
}

export function CriticalPointsTab({ criticalPoints }: CriticalPointsTabProps) {
  if (criticalPoints.length === 0) {
    return (
      <Card>
        <CardContent className="py-12">
          <div className="text-center text-muted-foreground">
            <AlertTriangle className="h-12 w-12 mx-auto mb-4 opacity-50" />
            <p className="text-lg font-medium">No Critical Points Found</p>
            <p className="text-sm mt-2">
              No critical points were detected in the analyzed region.
              <br />
              This could mean the function has no stationary points, or they
              exist outside the search domain.
            </p>
          </div>
        </CardContent>
      </Card>
    );
  }

  const minCount = criticalPoints.filter((cp) => cp.type === "minimum").length;
  const maxCount = criticalPoints.filter((cp) => cp.type === "maximum").length;
  const saddleCount = criticalPoints.filter((cp) => cp.type === "saddle").length;

  return (
    <div className="space-y-6">
      <div className="grid gap-4 md:grid-cols-3">
        <Card className="border-chart-1/30 bg-chart-1/5">
          <CardContent className="pt-6">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-full bg-chart-1/20">
                <TrendingDown className="h-5 w-5 text-chart-1" />
              </div>
              <div>
                <p className="text-2xl font-bold text-chart-1">{minCount}</p>
                <p className="text-sm text-muted-foreground">Local Minima</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-chart-2/30 bg-chart-2/5">
          <CardContent className="pt-6">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-full bg-chart-2/20">
                <TrendingUp className="h-5 w-5 text-chart-2" />
              </div>
              <div>
                <p className="text-2xl font-bold text-chart-2">{maxCount}</p>
                <p className="text-sm text-muted-foreground">Local Maxima</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-chart-3/30 bg-chart-3/5">
          <CardContent className="pt-6">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-full bg-chart-3/20">
                <AlertTriangle className="h-5 w-5 text-chart-3" />
              </div>
              <div>
                <p className="text-2xl font-bold text-chart-3">{saddleCount}</p>
                <p className="text-sm text-muted-foreground">Saddle Points</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Critical Points Table</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="rounded-lg border overflow-hidden">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-16">#</TableHead>
                  <TableHead>Point</TableHead>
                  <TableHead>
                    <InlineMath math="f(x, y)" />
                  </TableHead>
                  <TableHead>
                    <InlineMath math="D = f_{xx}f_{yy} - f_{xy}^2" />
                  </TableHead>
                  <TableHead>
                    <InlineMath math="f_{xx}" />
                  </TableHead>
                  <TableHead>Classification</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {criticalPoints.map((cp, index) => (
                  <TableRow
                    key={index}
                    className={cp.type === "saddle" ? "bg-chart-3/5" : ""}
                  >
                    <TableCell className="font-medium">{index + 1}</TableCell>
                    <TableCell className="font-mono">
                      ({cp.x}, {cp.y})
                    </TableCell>
                    <TableCell className="font-mono">{cp.fValue}</TableCell>
                    <TableCell className="font-mono">
                      {cp.hessianDeterminant}
                    </TableCell>
                    <TableCell className="font-mono">{cp.fxx}</TableCell>
                    <TableCell>{getTypeBadge(cp.type)}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Classification Rules</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid gap-3 md:grid-cols-2">
            <div className="p-3 rounded-lg border bg-chart-1/5 border-chart-1/20">
              <div className="flex items-center gap-2 mb-1">
                <TrendingDown className="h-4 w-4 text-chart-1" />
                <span className="font-medium text-chart-1">Local Minimum</span>
              </div>
              <p className="text-sm text-muted-foreground">
                <InlineMath math="D > 0" /> and <InlineMath math="f_{xx} > 0" />
              </p>
            </div>
            <div className="p-3 rounded-lg border bg-chart-2/5 border-chart-2/20">
              <div className="flex items-center gap-2 mb-1">
                <TrendingUp className="h-4 w-4 text-chart-2" />
                <span className="font-medium text-chart-2">Local Maximum</span>
              </div>
              <p className="text-sm text-muted-foreground">
                <InlineMath math="D > 0" /> and <InlineMath math="f_{xx} < 0" />
              </p>
            </div>
            <div className="p-3 rounded-lg border bg-chart-3/5 border-chart-3/20">
              <div className="flex items-center gap-2 mb-1">
                <AlertTriangle className="h-4 w-4 text-chart-3" />
                <span className="font-medium text-chart-3">Saddle Point</span>
              </div>
              <p className="text-sm text-muted-foreground">
                <InlineMath math="D < 0" />
              </p>
            </div>
            <div className="p-3 rounded-lg border bg-muted/50">
              <div className="flex items-center gap-2 mb-1">
                <HelpCircle className="h-4 w-4 text-muted-foreground" />
                <span className="font-medium">Inconclusive</span>
              </div>
              <p className="text-sm text-muted-foreground">
                <InlineMath math="D = 0" />
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

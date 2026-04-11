"use client";

import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ReferenceDot,
  ResponsiveContainer,
  ReferenceLine,
  Area,
  ComposedChart,
} from "recharts";
import { LineChart as LineChartIcon, Target, TrendingDown, TrendingUp } from "lucide-react";

interface CriticalPoint {
  x: number;
  y: number;
  type: "local-minimum" | "local-maximum" | "inflection" | "saddle";
  explanation: string;
}

interface InflectionPoint {
  x: number;
  y: number;
  explanation: string;
}

interface FunctionGraphProps {
  data: { x: number; y: number }[];
  criticalPoints: CriticalPoint[];
  inflectionPoints: InflectionPoint[];
  functionName: string;
}

export function FunctionGraph({
  data,
  criticalPoints,
  inflectionPoints,
  functionName,
}: FunctionGraphProps) {
  // Find min and max for better axis scaling
  const yValues = data.map((d) => d.y).filter((y) => isFinite(y));
  const yMin = Math.min(...yValues);
  const yMax = Math.max(...yValues);
  const yPadding = Math.max((yMax - yMin) * 0.15, 1);

  const getPointColor = (type: CriticalPoint["type"]) => {
    switch (type) {
      case "local-minimum":
        return "oklch(0.6 0.2 145)"; // success green
      case "local-maximum":
        return "oklch(0.55 0.22 25)"; // destructive red
      case "inflection":
        return "oklch(0.7 0.18 85)"; // warning yellow
      default:
        return "oklch(0.65 0.01 270)"; // muted
    }
  };

  const minPoints = criticalPoints.filter((p) => p.type === "local-minimum").length;
  const maxPoints = criticalPoints.filter((p) => p.type === "local-maximum").length;

  return (
    <div className="w-full">
      {/* Header */}
      <div className="mb-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-lg bg-primary/10">
            <LineChartIcon className="h-5 w-5 text-primary" />
          </div>
          <div>
            <h3 className="text-lg font-bold">Function Graph</h3>
            <p className="text-sm text-muted-foreground font-mono">
              f(x) = {functionName}
            </p>
          </div>
        </div>
        
        {/* Legend */}
        <div className="flex flex-wrap items-center gap-3 text-xs">
          <span className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-full bg-success/10 border border-success/20">
            <TrendingDown className="h-3 w-3 text-success" />
            <span className="font-medium">Min ({minPoints})</span>
          </span>
          <span className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-full bg-destructive/10 border border-destructive/20">
            <TrendingUp className="h-3 w-3 text-destructive" />
            <span className="font-medium">Max ({maxPoints})</span>
          </span>
          <span className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-full bg-warning/10 border border-warning/20">
            <Target className="h-3 w-3 text-warning-foreground" />
            <span className="font-medium">Inflection ({inflectionPoints.length})</span>
          </span>
        </div>
      </div>

      {/* Chart */}
      <div className="h-[350px] lg:h-[450px] w-full rounded-xl bg-card/50 p-2 lg:p-4 border border-border/50">
        <ResponsiveContainer width="100%" height="100%">
          <ComposedChart
            data={data}
            margin={{ top: 20, right: 20, left: 10, bottom: 20 }}
          >
            <defs>
              <linearGradient id="colorGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="oklch(0.55 0.25 270)" stopOpacity={0.3} />
                <stop offset="100%" stopColor="oklch(0.55 0.25 270)" stopOpacity={0} />
              </linearGradient>
              <filter id="glow">
                <feGaussianBlur stdDeviation="3" result="coloredBlur" />
                <feMerge>
                  <feMergeNode in="coloredBlur" />
                  <feMergeNode in="SourceGraphic" />
                </feMerge>
              </filter>
            </defs>
            
            <CartesianGrid
              strokeDasharray="3 3"
              stroke="oklch(0.5 0.01 270 / 0.15)"
              vertical={false}
            />
            <XAxis
              dataKey="x"
              type="number"
              domain={["dataMin", "dataMax"]}
              stroke="oklch(0.5 0.01 270)"
              fontSize={11}
              tickLine={false}
              axisLine={{ stroke: "oklch(0.5 0.01 270 / 0.2)" }}
              tick={{ fill: "oklch(0.5 0.01 270)" }}
            />
            <YAxis
              domain={[
                Math.floor(yMin - yPadding),
                Math.ceil(yMax + yPadding),
              ]}
              stroke="oklch(0.5 0.01 270)"
              fontSize={11}
              tickLine={false}
              axisLine={{ stroke: "oklch(0.5 0.01 270 / 0.2)" }}
              tick={{ fill: "oklch(0.5 0.01 270)" }}
            />
            <Tooltip
              contentStyle={{
                backgroundColor: "oklch(0.14 0.015 260 / 0.95)",
                backdropFilter: "blur(8px)",
                border: "1px solid oklch(0.3 0.015 260)",
                borderRadius: "12px",
                color: "oklch(0.95 0.005 270)",
                boxShadow: "0 10px 40px oklch(0 0 0 / 0.3)",
                padding: "12px 16px",
              }}
              labelStyle={{ color: "oklch(0.7 0.01 270)", marginBottom: "4px", fontSize: "12px" }}
              itemStyle={{ color: "oklch(0.95 0.005 270)", fontWeight: "600" }}
              labelFormatter={(value) => `x = ${Number(value).toFixed(3)}`}
              formatter={(value: number) => [
                `${value.toFixed(4)}`,
                "f(x)",
              ]}
              cursor={{ stroke: "oklch(0.55 0.25 270)", strokeWidth: 1, strokeDasharray: "5 5" }}
            />
            
            {/* Reference line at y=0 */}
            <ReferenceLine
              y={0}
              stroke="oklch(0.5 0.01 270 / 0.4)"
              strokeWidth={1}
            />
            
            {/* Reference line at x=0 */}
            <ReferenceLine
              x={0}
              stroke="oklch(0.5 0.01 270 / 0.4)"
              strokeWidth={1}
            />

            {/* Area under curve */}
            <Area
              type="monotone"
              dataKey="y"
              fill="url(#colorGradient)"
              stroke="none"
            />

            {/* Main function line */}
            <Line
              type="monotone"
              dataKey="y"
              stroke="oklch(0.55 0.25 270)"
              strokeWidth={3}
              dot={false}
              filter="url(#glow)"
              activeDot={{
                r: 8,
                fill: "oklch(0.55 0.25 270)",
                stroke: "oklch(0.98 0 0)",
                strokeWidth: 3,
                style: { filter: "drop-shadow(0 0 8px oklch(0.55 0.25 270))" },
              }}
            />

            {/* Critical points */}
            {criticalPoints.map((point, index) => (
              <ReferenceDot
                key={`critical-${index}`}
                x={point.x}
                y={point.y}
                r={10}
                fill={getPointColor(point.type)}
                stroke="oklch(0.98 0 0)"
                strokeWidth={3}
                style={{ filter: `drop-shadow(0 0 6px ${getPointColor(point.type)})` }}
              />
            ))}

            {/* Inflection points */}
            {inflectionPoints.map((point, index) => (
              <ReferenceDot
                key={`inflection-${index}`}
                x={point.x}
                y={point.y}
                r={8}
                fill="oklch(0.7 0.18 85)"
                stroke="oklch(0.98 0 0)"
                strokeWidth={2}
                style={{ filter: "drop-shadow(0 0 4px oklch(0.7 0.18 85))" }}
              />
            ))}
          </ComposedChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}

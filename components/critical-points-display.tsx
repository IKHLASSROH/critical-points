"use client";

import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { TrendingUp, TrendingDown, Minus, Circle } from "lucide-react";

interface CriticalPoint {
  x: number;
  y: number;
  type: "local-minimum" | "local-maximum" | "inflection" | "saddle";
  explanation: string;
}

interface CriticalPointsDisplayProps {
  points: CriticalPoint[];
}

const typeConfig = {
  "local-minimum": {
    label: "Local Minimum",
    icon: TrendingDown,
    className: "bg-success/10 text-success border-success/30",
  },
  "local-maximum": {
    label: "Local Maximum",
    icon: TrendingUp,
    className: "bg-destructive/10 text-destructive border-destructive/30",
  },
  inflection: {
    label: "Inflection",
    icon: Circle,
    className: "bg-warning/10 text-warning border-warning/30",
  },
  saddle: {
    label: "Saddle Point",
    icon: Minus,
    className: "bg-muted text-muted-foreground border-muted",
  },
};

export function CriticalPointsDisplay({ points }: CriticalPointsDisplayProps) {
  if (points.length === 0) {
    return (
      <p className="text-muted-foreground text-sm italic">
        No critical points found in the analyzed range
      </p>
    );
  }

  return (
    <div className="space-y-3">
      {points.map((point, index) => {
        const config = typeConfig[point.type];
        const Icon = config.icon;

        return (
          <div
            key={index}
            className={cn(
              "p-4 rounded-lg border transition-all duration-200 hover:shadow-md",
              config.className
            )}
          >
            <div className="flex items-start justify-between gap-4">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-full bg-background/50">
                  <Icon className="h-4 w-4" />
                </div>
                <div>
                  <Badge variant="outline" className="mb-1 font-normal">
                    {config.label}
                  </Badge>
                  <p className="font-mono text-lg font-semibold">
                    ({point.x}, {point.y})
                  </p>
                </div>
              </div>
            </div>
            <p className="mt-2 text-sm opacity-80 leading-relaxed">
              {point.explanation}
            </p>
          </div>
        );
      })}
    </div>
  );
}

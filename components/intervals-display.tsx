"use client";

import { Badge } from "@/components/ui/badge";
import { ArrowUp, ArrowDown, CornerRightUp, CornerRightDown } from "lucide-react";

interface IntervalsDisplayProps {
  intervals: {
    increasing: string[];
    decreasing: string[];
    concaveUp: string[];
    concaveDown: string[];
  };
}

export function IntervalsDisplay({ intervals }: IntervalsDisplayProps) {
  const sections = [
    {
      title: "Increasing",
      data: intervals.increasing,
      icon: ArrowUp,
      color: "text-success",
      bg: "bg-success/10",
    },
    {
      title: "Decreasing",
      data: intervals.decreasing,
      icon: ArrowDown,
      color: "text-destructive",
      bg: "bg-destructive/10",
    },
    {
      title: "Concave Up",
      data: intervals.concaveUp,
      icon: CornerRightUp,
      color: "text-primary",
      bg: "bg-primary/10",
    },
    {
      title: "Concave Down",
      data: intervals.concaveDown,
      icon: CornerRightDown,
      color: "text-warning",
      bg: "bg-warning/10",
    },
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
      {sections.map((section) => {
        const Icon = section.icon;
        return (
          <div
            key={section.title}
            className={`p-4 rounded-lg ${section.bg} transition-all duration-200`}
          >
            <div className="flex items-center gap-2 mb-3">
              <Icon className={`h-4 w-4 ${section.color}`} />
              <span className={`font-medium ${section.color}`}>
                {section.title}
              </span>
            </div>
            <div className="flex flex-wrap gap-2">
              {section.data.length > 0 ? (
                section.data.map((interval, idx) => (
                  <Badge
                    key={idx}
                    variant="secondary"
                    className="font-mono text-xs"
                  >
                    {interval}
                  </Badge>
                ))
              ) : (
                <span className="text-muted-foreground text-sm italic">
                  None found
                </span>
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
}

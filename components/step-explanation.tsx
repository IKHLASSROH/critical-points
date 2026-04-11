"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { ChevronDown, ChevronUp, BookOpen, Lightbulb, CheckCircle2 } from "lucide-react";

interface StepExplanationProps {
  steps: string[];
}

export function StepExplanation({ steps }: StepExplanationProps) {
  const [isExpanded, setIsExpanded] = useState(false);

  const displayedSteps = isExpanded ? steps : steps.slice(0, 6);

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-lg bg-primary/10">
            <BookOpen className="h-5 w-5 text-primary" />
          </div>
          <div>
            <h3 className="text-lg font-bold">Step-by-Step Analysis</h3>
            <p className="text-xs text-muted-foreground">{steps.length} steps total</p>
          </div>
        </div>
        <div className="hidden sm:flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-success/10 border border-success/20">
          <Lightbulb className="h-3.5 w-3.5 text-success" />
          <span className="text-xs font-medium text-success">Educational</span>
        </div>
      </div>

      <div className="space-y-2">
        {displayedSteps.map((step, index) => {
          const isStepHeader = step.startsWith("Step");
          const stepNumber = isStepHeader ? step.match(/Step (\d+)/)?.[1] : null;
          
          return (
            <div
              key={index}
              className={cn(
                "relative rounded-xl transition-all duration-300 hover:translate-x-1",
                isStepHeader
                  ? "bg-primary/10 border border-primary/20 p-4"
                  : "bg-secondary/30 border border-border/50 p-3 ml-4"
              )}
              style={{ animationDelay: `${index * 0.05}s` }}
            >
              {isStepHeader && stepNumber && (
                <div className="absolute -left-3 top-1/2 -translate-y-1/2 w-6 h-6 rounded-full bg-primary text-primary-foreground text-xs font-bold flex items-center justify-center shadow-lg shadow-primary/30">
                  {stepNumber}
                </div>
              )}
              {!isStepHeader && (
                <CheckCircle2 className="absolute left-3 top-3.5 h-3.5 w-3.5 text-muted-foreground/50" />
              )}
              <p className={cn(
                "font-mono text-sm leading-relaxed",
                isStepHeader ? "font-semibold text-foreground pl-2" : "text-muted-foreground pl-6"
              )}>
                {step}
              </p>
            </div>
          );
        })}
      </div>

      {steps.length > 6 && (
        <Button
          variant="outline"
          size="sm"
          onClick={() => setIsExpanded(!isExpanded)}
          className="w-full rounded-xl border-dashed hover:border-primary hover:bg-primary/5 transition-all duration-300"
        >
          {isExpanded ? (
            <>
              <ChevronUp className="mr-2 h-4 w-4" />
              Show Less
            </>
          ) : (
            <>
              <ChevronDown className="mr-2 h-4 w-4" />
              Show All {steps.length} Steps
            </>
          )}
        </Button>
      )}
    </div>
  );
}

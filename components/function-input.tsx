"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Spinner } from "@/components/ui/spinner";
import { Sparkles, Zap } from "lucide-react";

interface FunctionInputProps {
  onAnalyze: (fn: string) => void;
  isLoading: boolean;
}

const singleVarExamples = [
  { label: "Cubic", fn: "x^3 - 3x + 2", color: "bg-chart-1/10 border-chart-1/30 hover:bg-chart-1/20" },
  { label: "Quadratic", fn: "x^2 - 4x + 3", color: "bg-chart-2/10 border-chart-2/30 hover:bg-chart-2/20" },
  { label: "Trig", fn: "sin(x)", color: "bg-chart-3/10 border-chart-3/30 hover:bg-chart-3/20" },
];

const multiVarExamples = [
  { label: "f(x,y)", fn: "x^2 + y^2", color: "bg-chart-4/10 border-chart-4/30 hover:bg-chart-4/20" },
  { label: "f(x,y,z)", fn: "x^2 + y^2 + z^2", color: "bg-chart-5/10 border-chart-5/30 hover:bg-chart-5/20" },
  { label: "Mixed", fn: "x*y + y*z + x*z", color: "bg-primary/10 border-primary/30 hover:bg-primary/20" },
  { label: "Saddle", fn: "x^2 - y^2", color: "bg-accent/10 border-accent/30 hover:bg-accent/20" },
];

export function FunctionInput({ onAnalyze, isLoading }: FunctionInputProps) {
  const [functionInput, setFunctionInput] = useState("x^3 - 3x + 2");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (functionInput.trim()) {
      onAnalyze(functionInput.trim());
    }
  };

  return (
    <div className="space-y-5">
      <form onSubmit={handleSubmit} className="relative">
        <div className="flex flex-col gap-3 sm:flex-row p-2 rounded-2xl bg-card border border-border/50 shadow-lg shadow-primary/5">
          <div className="flex-1 relative">
            <div className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground">
              <span className="font-mono text-lg font-semibold">f(...) =</span>
            </div>
            <label htmlFor="function-input" className="sr-only">
              Enter function f(x)
            </label>
            <Input
              id="function-input"
              type="text"
              placeholder="x^3 - 3x + 2 or x^2 + y^2"
              value={functionInput}
              onChange={(e) => setFunctionInput(e.target.value)}
              className="h-14 pl-20 text-lg font-mono bg-transparent border-0 focus-visible:ring-0 focus-visible:ring-offset-0"
              disabled={isLoading}
            />
          </div>
          <Button
            type="submit"
            disabled={isLoading || !functionInput.trim()}
            className="h-14 px-8 text-base font-semibold rounded-xl bg-primary hover:bg-primary/90 transition-all duration-300 hover:shadow-lg hover:shadow-primary/25"
          >
            {isLoading ? (
              <>
                <Spinner className="mr-2 h-5 w-5" />
                Analyzing...
              </>
            ) : (
              <>
                <Zap className="mr-2 h-5 w-5" />
                Analyze
              </>
            )}
          </Button>
        </div>
      </form>

      <div className="space-y-3">
        {/* Single Variable Examples */}
        <div className="flex flex-wrap items-center gap-2 justify-center sm:justify-start">
          <div className="flex items-center gap-1.5 text-sm text-muted-foreground">
            <Sparkles className="h-4 w-4" />
            <span>Single variable:</span>
          </div>
          {singleVarExamples.map((example) => (
            <Button
              key={example.fn}
              variant="outline"
              size="sm"
              onClick={() => setFunctionInput(example.fn)}
              className={`font-mono text-xs rounded-full border transition-all duration-200 ${example.color}`}
              disabled={isLoading}
            >
              {example.label}
            </Button>
          ))}
        </div>

        {/* Multi Variable Examples */}
        <div className="flex flex-wrap items-center gap-2 justify-center sm:justify-start">
          <div className="flex items-center gap-1.5 text-sm text-muted-foreground">
            <Sparkles className="h-4 w-4 text-primary" />
            <span>Multi-variable:</span>
          </div>
          {multiVarExamples.map((example) => (
            <Button
              key={example.fn}
              variant="outline"
              size="sm"
              onClick={() => setFunctionInput(example.fn)}
              className={`font-mono text-xs rounded-full border transition-all duration-200 ${example.color}`}
              disabled={isLoading}
            >
              {example.label}
            </Button>
          ))}
        </div>
      </div>
    </div>
  );
}

"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { Spinner } from "@/components/ui/spinner";
import { Activity, Lightbulb, Sparkles, ArrowRight } from "lucide-react";

interface FunctionInputProps {
  onAnalyze: (func: string) => void;
  isLoading: boolean;
}

const sampleFunctions = [
  { func: "x^2 + y^2", description: "Simple paraboloid (minimum at origin)", type: "min" },
  { func: "x^2 - y^2", description: "Hyperbolic paraboloid (saddle point)", type: "saddle" },
  { func: "-x^2 - y^2", description: "Inverted paraboloid (maximum)", type: "max" },
  { func: "x^3 - 3*x*y^2", description: "Monkey saddle", type: "special" },
  { func: "sin(x) * cos(y)", description: "Wave surface", type: "special" },
  { func: "x^2 + y^2 - 2*x - 4*y + 5", description: "Shifted paraboloid", type: "min" },
  { func: "(x^2 + y^2)^2 - 2*(x^2 - y^2)", description: "Lemniscate surface", type: "special" },
  { func: "x*y*exp(-(x^2+y^2))", description: "Gaussian saddle", type: "saddle" },
];

const typeColors = {
  min: "from-chart-1 to-emerald-500",
  max: "from-chart-2 to-rose-500",
  saddle: "from-chart-3 to-amber-500",
  special: "from-primary to-violet-500",
};

export function FunctionInput({ onAnalyze, isLoading }: FunctionInputProps) {
  const [func, setFunc] = useState("");
  const [isFocused, setIsFocused] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (func.trim()) {
      onAnalyze(func.trim());
    }
  };

  const handleSampleClick = (sample: string) => {
    setFunc(sample);
    onAnalyze(sample);
  };

  return (
    <div className="space-y-8">
      {/* Main Input Card */}
      <div className="relative group">
        {/* Animated border gradient */}
        <div className={`absolute -inset-0.5 bg-gradient-to-r from-primary via-chart-1 to-chart-5 rounded-2xl transition-opacity duration-500 ${isFocused ? 'opacity-100' : 'opacity-0 group-hover:opacity-50'} blur-sm`} />
        <div className={`absolute -inset-0.5 bg-gradient-to-r from-primary via-chart-1 to-chart-5 rounded-2xl transition-opacity duration-500 ${isFocused ? 'opacity-75' : 'opacity-0 group-hover:opacity-30'}`} />
        
        <Card className="relative border-0 bg-card/95 backdrop-blur-xl shadow-2xl shadow-primary/10">
          <CardContent className="pt-8 pb-8 px-8">
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Label */}
              <div className="flex items-center gap-3">
                <div className="flex items-center justify-center w-10 h-10 rounded-xl bg-gradient-to-br from-primary to-chart-1 shadow-lg shadow-primary/25">
                  <Sparkles className="h-5 w-5 text-white" />
                </div>
                <div>
                  <h3 className="font-bold text-lg">Enter Your Function</h3>
                  <p className="text-sm text-muted-foreground">Type a function of two variables f(x, y)</p>
                </div>
              </div>

              {/* Input Row */}
              <div className="flex flex-col gap-4 sm:flex-row">
                <div className="relative flex-1 group/input">
                  <span className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground font-mono text-sm font-semibold">
                    f(x,y) =
                  </span>
                  <Input
                    value={func}
                    onChange={(e) => setFunc(e.target.value)}
                    onFocus={() => setIsFocused(true)}
                    onBlur={() => setIsFocused(false)}
                    placeholder="x^2 + y^2"
                    className="pl-24 h-14 text-lg font-mono bg-muted/30 border-2 border-border/50 focus:border-primary/50 rounded-xl transition-all duration-300 placeholder:text-muted-foreground/50"
                    disabled={isLoading}
                  />
                </div>
                <Button
                  type="submit"
                  size="lg"
                  disabled={!func.trim() || isLoading}
                  className="relative h-14 px-8 gap-3 rounded-xl text-base font-semibold bg-gradient-to-r from-primary to-chart-1 hover:from-primary/90 hover:to-chart-1/90 shadow-lg shadow-primary/25 transition-all duration-300 hover:shadow-xl hover:shadow-primary/30 hover:scale-[1.02] disabled:opacity-50 disabled:hover:scale-100 overflow-hidden group/btn"
                >
                  <div className="absolute inset-0 bg-gradient-to-r from-white/0 via-white/20 to-white/0 -translate-x-full group-hover/btn:translate-x-full transition-transform duration-700" />
                  {isLoading ? (
                    <>
                      <Spinner className="h-5 w-5" />
                      <span>Analyzing...</span>
                    </>
                  ) : (
                    <>
                      <Activity className="h-5 w-5" />
                      <span>Analyze</span>
                      <ArrowRight className="h-4 w-4 transition-transform group-hover/btn:translate-x-1" />
                    </>
                  )}
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>

      {/* Sample Functions */}
      <div className="space-y-4">
        <div className="flex items-center gap-3 text-sm">
          <div className="flex items-center justify-center w-8 h-8 rounded-lg bg-amber-500/10 border border-amber-500/20">
            <Lightbulb className="h-4 w-4 text-amber-500" />
          </div>
          <span className="font-medium text-muted-foreground">Try one of these examples:</span>
        </div>
        <div className="flex flex-wrap gap-3 stagger-children">
          {sampleFunctions.map((sample, index) => (
            <button
              key={index}
              onClick={() => handleSampleClick(sample.func)}
              disabled={isLoading}
              className="group relative px-4 py-2.5 text-sm font-mono bg-card/80 hover:bg-card rounded-xl border border-border/50 transition-all duration-300 hover:border-primary/50 disabled:opacity-50 hover:scale-105 hover:shadow-lg hover:shadow-primary/10"
            >
              {/* Gradient indicator */}
              <div className={`absolute left-0 top-0 bottom-0 w-1 rounded-l-xl bg-gradient-to-b ${typeColors[sample.type as keyof typeof typeColors]} opacity-50 group-hover:opacity-100 transition-opacity`} />
              
              <span className="font-semibold">{sample.func}</span>
              
              {/* Tooltip */}
              <span className="absolute -top-12 left-1/2 -translate-x-1/2 px-3 py-2 text-xs font-sans bg-popover text-popover-foreground rounded-lg shadow-xl opacity-0 group-hover:opacity-100 transition-all duration-300 whitespace-nowrap pointer-events-none z-10 border border-border/50 translate-y-2 group-hover:translate-y-0">
                {sample.description}
                <div className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-2 h-2 bg-popover border-r border-b border-border/50 rotate-45" />
              </span>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}

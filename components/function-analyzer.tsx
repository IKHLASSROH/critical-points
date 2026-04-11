"use client";

import { useState, useCallback } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { FunctionInput } from "@/components/function-input";
import { DerivativesTab } from "@/components/tabs/derivatives-tab";
import { CriticalPointsTab } from "@/components/tabs/critical-points-tab";
import { Surface3DTab } from "@/components/tabs/surface-3d-tab";
import { ContourTab } from "@/components/tabs/contour-tab";
import { ExplanationTab } from "@/components/tabs/explanation-tab";
import type { AnalysisResult, HistoryEntry } from "@/lib/types";
import {
  Calculator,
  Target,
  Box,
  Grid3x3,
  GraduationCap,
  History,
  AlertCircle,
  X,
  Sparkles,
  Zap,
} from "lucide-react";

const tabItems = [
  { value: "derivatives", label: "Derivatives", icon: Calculator, color: "from-chart-4 to-violet-500" },
  { value: "critical", label: "Critical Points", icon: Target, color: "from-chart-1 to-emerald-500" },
  { value: "surface", label: "3D Surface", icon: Box, color: "from-primary to-blue-500" },
  { value: "contour", label: "Contour", icon: Grid3x3, color: "from-chart-5 to-cyan-500" },
  { value: "explanation", label: "Learn", icon: GraduationCap, color: "from-chart-3 to-amber-500" },
];

export function FunctionAnalyzer() {
  const [result, setResult] = useState<AnalysisResult | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [history, setHistory] = useState<HistoryEntry[]>([]);
  const [activeTab, setActiveTab] = useState("derivatives");

  const analyzeFunction = useCallback(async (func: string) => {
    setIsLoading(true);
    setError(null);

    try {
      const response = await fetch("/api/analyze-multivariable", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ function: func }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Failed to analyze function");
      }

      setResult(data);

      // Add to history
      setHistory((prev) => {
        const newEntry: HistoryEntry = {
          id: Date.now().toString(),
          function: func,
          timestamp: new Date(),
          criticalPointsCount: data.criticalPoints?.length || 0,
        };
        return [newEntry, ...prev.slice(0, 9)]; // Keep last 10
      });
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred");
      setResult(null);
    } finally {
      setIsLoading(false);
    }
  }, []);

  const loadFromHistory = useCallback(
    (entry: HistoryEntry) => {
      analyzeFunction(entry.function);
    },
    [analyzeFunction]
  );

  return (
    <div className="space-y-8">
      <FunctionInput onAnalyze={analyzeFunction} isLoading={isLoading} />

      {error && (
        <Alert variant="destructive" className="animate-slide-up border-2">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>Error</AlertTitle>
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      {history.length > 0 && (
        <Card className="border-dashed border-2 bg-card/50 backdrop-blur-sm animate-slide-up">
          <CardContent className="pt-5 pb-5">
            <div className="flex items-center gap-3 mb-4">
              <div className="flex items-center justify-center w-8 h-8 rounded-lg bg-muted">
                <History className="h-4 w-4 text-muted-foreground" />
              </div>
              <span className="text-sm font-semibold text-muted-foreground">
                Recent Functions
              </span>
            </div>
            <div className="flex flex-wrap gap-2">
              {history.map((entry) => (
                <button
                  key={entry.id}
                  onClick={() => loadFromHistory(entry)}
                  className="group flex items-center gap-2.5 px-4 py-2 text-xs font-mono bg-muted/50 hover:bg-muted rounded-lg border border-border/50 hover:border-primary/50 transition-all duration-300 hover:scale-105"
                >
                  <span className="font-semibold">{entry.function}</span>
                  <span className="text-muted-foreground px-1.5 py-0.5 bg-background/50 rounded text-[10px]">
                    {entry.criticalPointsCount} pts
                  </span>
                </button>
              ))}
              {history.length > 0 && (
                <Button
                  variant="ghost"
                  size="sm"
                  className="h-8 px-3 text-muted-foreground hover:text-destructive"
                  onClick={() => setHistory([])}
                >
                  <X className="h-3 w-3 mr-1" />
                  Clear
                </Button>
              )}
            </div>
          </CardContent>
        </Card>
      )}

      {result && (
        <div className="space-y-6 animate-scale-in">
          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
            {/* Custom Tab List */}
            <div className="relative">
              <div className="absolute -inset-1 bg-gradient-to-r from-primary/20 via-chart-1/20 to-chart-5/20 rounded-2xl blur-lg opacity-50" />
              <TabsList className="relative grid grid-cols-5 w-full h-auto p-1.5 bg-card/95 backdrop-blur-xl border border-border/50 rounded-xl shadow-lg">
                {tabItems.map((tab) => {
                  const Icon = tab.icon;
                  const isActive = activeTab === tab.value;
                  return (
                    <TabsTrigger
                      key={tab.value}
                      value={tab.value}
                      className={`relative flex items-center justify-center gap-2 py-3 px-2 rounded-lg font-medium transition-all duration-300 ${
                        isActive 
                          ? 'text-foreground shadow-md' 
                          : 'text-muted-foreground hover:text-foreground'
                      }`}
                    >
                      {isActive && (
                        <div className={`absolute inset-0 bg-gradient-to-r ${tab.color} opacity-15 rounded-lg`} />
                      )}
                      <div className={`relative flex items-center justify-center w-8 h-8 rounded-lg transition-all duration-300 ${
                        isActive 
                          ? `bg-gradient-to-br ${tab.color} shadow-lg` 
                          : 'bg-muted/50'
                      }`}>
                        <Icon className={`h-4 w-4 ${isActive ? 'text-white' : ''}`} />
                      </div>
                      <span className="hidden md:inline text-sm">{tab.label}</span>
                    </TabsTrigger>
                  );
                })}
              </TabsList>
            </div>

            <div className="mt-8">
              <TabsContent value="derivatives" className="mt-0 animate-slide-up">
                <DerivativesTab
                  functionLatex={result.functionLatex}
                  partialDerivatives={result.partialDerivatives}
                  hessian={result.hessian}
                />
              </TabsContent>

              <TabsContent value="critical" className="mt-0 animate-slide-up">
                <CriticalPointsTab criticalPoints={result.criticalPoints} />
              </TabsContent>

              <TabsContent value="surface" className="mt-0 animate-slide-up">
                <Surface3DTab
                  surfaceData={result.surfaceData}
                  criticalPoints={result.criticalPoints}
                  functionStr={result.originalFunction}
                />
              </TabsContent>

              <TabsContent value="contour" className="mt-0 animate-slide-up">
                <ContourTab
                  contourData={result.contourData}
                  criticalPoints={result.criticalPoints}
                  functionStr={result.originalFunction}
                />
              </TabsContent>

              <TabsContent value="explanation" className="mt-0 animate-slide-up">
                <ExplanationTab steps={result.steps} />
              </TabsContent>
            </div>
          </Tabs>
        </div>
      )}

      {!result && !error && !isLoading && (
        <Card className="relative overflow-hidden border-2 border-dashed bg-card/50 backdrop-blur-sm">
          {/* Background decoration */}
          <div className="absolute inset-0 overflow-hidden pointer-events-none">
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-primary/5 rounded-full blur-3xl" />
          </div>
          
          <CardContent className="relative py-20">
            <div className="text-center space-y-6">
              {/* Animated icon */}
              <div className="relative inline-flex">
                <div className="absolute inset-0 bg-gradient-to-r from-primary to-chart-1 rounded-2xl blur-xl opacity-50 animate-glow-pulse" />
                <div className="relative flex items-center justify-center w-20 h-20 rounded-2xl bg-gradient-to-br from-primary to-chart-1 shadow-2xl shadow-primary/30">
                  <Calculator className="h-10 w-10 text-white" />
                </div>
              </div>
              
              <div className="space-y-3">
                <h3 className="text-2xl font-bold">
                  <span className="text-gradient-primary animate-text-gradient">
                    Multivariable Function Analyzer
                  </span>
                </h3>
                <p className="text-muted-foreground max-w-md mx-auto leading-relaxed">
                  Enter a function of two variables f(x, y) to analyze its
                  critical points, visualize the surface in 3D, and get
                  step-by-step explanations.
                </p>
              </div>
              
              <div className="flex flex-wrap justify-center gap-2 pt-4 stagger-children">
                {["Partial Derivatives", "Critical Points", "Hessian Matrix", "3D Visualization", "Saddle Points"].map((feature) => (
                  <span 
                    key={feature}
                    className="px-3 py-1.5 text-sm font-medium bg-muted/50 text-muted-foreground rounded-lg border border-border/50"
                  >
                    {feature}
                  </span>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}

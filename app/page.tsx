"use client";

import { useState, useCallback, useEffect } from "react";
import { FunctionInput } from "@/components/function-input";
import { ResultCard } from "@/components/result-card";
import { FunctionGraph } from "@/components/function-graph";
import { CriticalPointsDisplay } from "@/components/critical-points-display";
import { IntervalsDisplay } from "@/components/intervals-display";
import { StepExplanation } from "@/components/step-explanation";
import { ValuesTable } from "@/components/values-table";
import { HistorySidebar } from "@/components/history-sidebar";
import { ThemeToggle } from "@/components/theme-toggle";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import {
  History,
  FunctionSquare,
  Diff,
  Target,
  TrendingUp,
  AlertCircle,
  Sparkles,
  GraduationCap,
  Heart,
  Github,
  Linkedin,
  Mail,
  ChevronDown,
  Sigma,
  LineChart,
  Braces,
  ArrowRight,
  ExternalLink,
  Code2,
  Layers,
  Zap,
} from "lucide-react";

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

interface PartialDerivative {
  variable: string;
  first: string;
  second: string;
}

interface MixedPartial {
  variables: string;
  derivative: string;
}

interface AnalysisResult {
  originalFunction: string;
  variables: string[];
  firstDerivative: string;
  secondDerivative: string;
  criticalPoints: CriticalPoint[];
  inflectionPoints: InflectionPoint[];
  intervals: {
    increasing: string[];
    decreasing: string[];
    concaveUp: string[];
    concaveDown: string[];
  };
  tableOfValues: { x: number; y: number }[];
  partialDerivatives: PartialDerivative[];
  gradient: string;
  hessianMatrix: string[][];
  mixedPartials: MixedPartial[];
  steps: string[];
}

interface HistoryItem {
  id: string;
  function: string;
  timestamp: Date;
}

// Floating math symbols for background
const MathSymbols = () => {
  const symbols = ["∫", "∑", "∂", "π", "∞", "√", "Δ", "∇", "θ", "λ"];
  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      {symbols.map((symbol, i) => (
        <span
          key={i}
          className="absolute text-primary/5 dark:text-primary/10 font-mono select-none"
          style={{
            fontSize: `${Math.random() * 40 + 20}px`,
            left: `${Math.random() * 100}%`,
            top: `${Math.random() * 100}%`,
            transform: `rotate(${Math.random() * 30 - 15}deg)`,
            animationDelay: `${i * 0.5}s`,
          }}
        >
          {symbol}
        </span>
      ))}
    </div>
  );
};

export default function Home() {
  const [result, setResult] = useState<AnalysisResult | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [history, setHistory] = useState<HistoryItem[]>([]);
  const [isHistoryOpen, setIsHistoryOpen] = useState(false);
  const [showHero, setShowHero] = useState(true);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const analyzeFunction = useCallback(async (functionInput: string) => {
    setIsLoading(true);
    setError(null);
    setShowHero(false);

    try {
      const response = await fetch("/api/analyze", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ functionInput }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Failed to analyze function");
      }

      setResult(data);

      setHistory((prev) => {
        const newItem: HistoryItem = {
          id: Date.now().toString(),
          function: functionInput,
          timestamp: new Date(),
        };
        const filtered = prev.filter((item) => item.function !== functionInput);
        return [newItem, ...filtered].slice(0, 20);
      });
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred");
      setResult(null);
    } finally {
      setIsLoading(false);
    }
  }, []);

  const handleHistorySelect = useCallback(
    (fn: string) => {
      analyzeFunction(fn);
    },
    [analyzeFunction]
  );

  const clearHistory = useCallback(() => {
    setHistory([]);
  }, []);

  const scrollToInput = () => {
    document.getElementById("function-input-section")?.scrollIntoView({
      behavior: "smooth",
      block: "center",
    });
  };

  if (!mounted) return null;

  return (
    <div className="min-h-screen bg-background flex flex-col relative">
      {/* Animated Background */}
      <div className="fixed inset-0 -z-10 overflow-hidden grid-pattern">
        {/* Primary blob */}
        <div
          className="absolute top-0 -left-40 w-[500px] h-[500px] bg-primary/15 dark:bg-primary/10 blob blur-3xl animate-float"
          style={{ animationDuration: "12s" }}
        />
        {/* Secondary blob */}
        <div
          className="absolute bottom-0 -right-40 w-[600px] h-[600px] bg-accent/15 dark:bg-accent/10 blob blur-3xl animate-float-delayed"
          style={{ animationDuration: "15s", animationDelay: "-5s" }}
        />
        {/* Center glow */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-primary/5 rounded-full blur-3xl" />
        {/* Math symbols */}
        <MathSymbols />
      </div>

      {/* Header */}
      <header className="sticky top-0 z-40 border-b border-border/40 glass">
        <div className="container mx-auto px-4 py-3 lg:py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3 group">
              <div className="relative p-2.5 rounded-xl bg-primary/10 glow-border transition-transform duration-300 group-hover:scale-105">
                <FunctionSquare className="h-6 w-6 text-primary" />
              </div>
              <div>
                <h1 className="text-lg lg:text-xl font-bold tracking-tight">
                  <span className="text-gradient">Function Analyzer</span>
                </h1>
                <p className="text-[10px] lg:text-xs text-muted-foreground font-medium tracking-wide uppercase">
                  by Rohni Ikhlass
                </p>
              </div>
            </div>
            <div className="flex items-center gap-1 lg:gap-2">
              <ThemeToggle />
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setIsHistoryOpen(true)}
                className="relative hover:bg-primary/10 transition-all duration-300 hover:scale-105"
              >
                <History className="h-4 w-4" />
                {history.length > 0 && (
                  <span className="absolute -top-1 -right-1 w-5 h-5 rounded-full bg-primary text-primary-foreground text-[10px] font-bold flex items-center justify-center shadow-lg shadow-primary/30">
                    {history.length}
                  </span>
                )}
                <span className="sr-only">View history</span>
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-6 lg:py-10 flex-grow">
        {/* Hero Section */}
        {showHero && !result && !isLoading && (
          <div className="relative py-12 lg:py-24 mb-8">
            {/* Hero Content */}
            <div className="text-center max-w-4xl mx-auto">
              {/* Badge */}
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 border border-primary/20 mb-8 animate-slide-up">
                <Zap className="h-4 w-4 text-primary" />
                <span className="text-sm font-medium text-primary">
                  Powerful Mathematical Analysis
                </span>
              </div>

              {/* Main Title */}
              <h2
                className="text-4xl sm:text-5xl lg:text-7xl font-black mb-6 tracking-tight animate-slide-up"
                style={{ animationDelay: "0.1s" }}
              >
                <span className="text-gradient">Analyze Functions</span>
                <br />
                <span className="text-foreground/90">Like a Pro</span>
              </h2>

              {/* Subtitle */}
              <p
                className="text-base lg:text-xl text-muted-foreground max-w-2xl mx-auto mb-10 text-pretty leading-relaxed animate-slide-up"
                style={{ animationDelay: "0.2s" }}
              >
                Compute derivatives, discover critical points, analyze intervals,
                and visualize your mathematical functions with stunning
                interactive graphs.
              </p>

              {/* Feature Cards */}
              <div
                className="grid grid-cols-2 lg:grid-cols-4 gap-3 lg:gap-4 mb-12 animate-slide-up"
                style={{ animationDelay: "0.3s" }}
              >
                {[
                  {
                    icon: Sigma,
                    label: "Derivatives",
                    desc: "1st & 2nd order",
                    color: "primary",
                  },
                  {
                    icon: Target,
                    label: "Critical Points",
                    desc: "Min & Max",
                    color: "success",
                  },
                  {
                    icon: LineChart,
                    label: "Visualization",
                    desc: "Interactive graphs",
                    color: "accent",
                  },
                  {
                    icon: Layers,
                    label: "Intervals",
                    desc: "Increase & Decrease",
                    color: "warning",
                  },
                ].map((feature, i) => (
                  <div
                    key={feature.label}
                    className="group glass-card p-4 lg:p-5 rounded-2xl hover-lift cursor-default"
                    style={{ animationDelay: `${0.4 + i * 0.1}s` }}
                  >
                    <div
                      className={`inline-flex p-2.5 rounded-xl bg-${feature.color}/10 mb-3 transition-transform duration-300 group-hover:scale-110`}
                    >
                      <feature.icon
                        className={`h-5 w-5 text-${feature.color === "primary" ? "primary" : feature.color === "success" ? "success" : feature.color === "accent" ? "accent-foreground" : "warning-foreground"}`}
                      />
                    </div>
                    <h3 className="font-semibold text-sm lg:text-base mb-1">
                      {feature.label}
                    </h3>
                    <p className="text-xs text-muted-foreground">{feature.desc}</p>
                  </div>
                ))}
              </div>

              {/* CTA */}
              <div
                className="animate-slide-up"
                style={{ animationDelay: "0.5s" }}
              >
                <Button
                  size="lg"
                  onClick={scrollToInput}
                  className="group h-14 px-8 text-base font-semibold rounded-2xl bg-primary hover:bg-primary/90 shadow-xl shadow-primary/25 hover:shadow-2xl hover:shadow-primary/30 transition-all duration-300"
                >
                  Start Analyzing
                  <ChevronDown className="ml-2 h-5 w-5 transition-transform duration-300 group-hover:translate-y-1" />
                </Button>
              </div>
            </div>
          </div>
        )}

        {/* Input Section */}
        <section id="function-input-section" className="mb-8">
          <FunctionInput onAnalyze={analyzeFunction} isLoading={isLoading} />
        </section>

        {/* Error Display */}
        {error && (
          <Alert
            variant="destructive"
            className="mb-8 animate-in fade-in-0 slide-in-from-top-4 duration-500"
          >
            <AlertCircle className="h-4 w-4" />
            <AlertTitle>Analysis Error</AlertTitle>
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        {/* Results */}
        {result && (
          <div className="space-y-6 lg:space-y-8">
            {/* Function Header with Variables */}
            <div
              className="animate-slide-up"
              style={{ animationDelay: "0.1s" }}
            >
              <ResultCard
                title="Original Function"
                icon={<FunctionSquare className="h-4 w-4" />}
                variant="highlight"
                className="glass-card glow-border"
              >
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                  <p className="font-mono text-lg lg:text-xl font-medium">
                    f({result.variables.join(", ")}) = {result.originalFunction}
                  </p>
                  <div className="flex items-center gap-2">
                    <span className="text-xs text-muted-foreground">Variables:</span>
                    <div className="flex gap-1">
                      {result.variables.map((v) => (
                        <span
                          key={v}
                          className="px-2 py-0.5 rounded-full bg-primary/10 text-primary text-xs font-mono font-semibold"
                        >
                          {v}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              </ResultCard>
            </div>

            {/* Partial Derivatives for Multi-Variable */}
            {result.variables.length > 1 && (
              <div
                className="animate-slide-up"
                style={{ animationDelay: "0.15s" }}
              >
                <ResultCard
                  title="Partial Derivatives"
                  icon={<Diff className="h-4 w-4" />}
                  className="glass-card"
                >
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {result.partialDerivatives.map((pd) => (
                      <div
                        key={pd.variable}
                        className="p-4 rounded-xl bg-secondary/50 border border-border/50 hover-lift transition-all duration-300"
                      >
                        <div className="flex items-center gap-2 mb-3">
                          <span className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center font-mono font-bold text-primary">
                            {pd.variable}
                          </span>
                          <span className="text-sm text-muted-foreground">
                            with respect to {pd.variable}
                          </span>
                        </div>
                        <div className="space-y-2 font-mono text-sm">
                          <p>
                            <span className="text-muted-foreground">First: </span>
                            <span className="font-semibold">df/d{pd.variable} = {pd.first}</span>
                          </p>
                          <p>
                            <span className="text-muted-foreground">Second: </span>
                            <span className="font-semibold">d²f/d{pd.variable}² = {pd.second}</span>
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                </ResultCard>
              </div>
            )}

            {/* Gradient Vector for Multi-Variable */}
            {result.variables.length > 1 && (
              <div
                className="grid grid-cols-1 lg:grid-cols-2 gap-4 animate-slide-up"
                style={{ animationDelay: "0.18s" }}
              >
                <ResultCard
                  title="Gradient Vector"
                  icon={<TrendingUp className="h-4 w-4" />}
                  variant="highlight"
                  className="glass-card"
                >
                  <div className="space-y-3">
                    <p className="font-mono text-lg">
                      <span className="text-primary font-bold">nabla f = </span>
                      {result.gradient}
                    </p>
                    <p className="text-sm text-muted-foreground">
                      The gradient points in the direction of steepest ascent
                    </p>
                  </div>
                </ResultCard>

                {result.mixedPartials.length > 0 && (
                  <ResultCard
                    title="Mixed Partial Derivatives"
                    icon={<Braces className="h-4 w-4" />}
                    className="glass-card"
                  >
                    <div className="space-y-2">
                      {result.mixedPartials.map((mp, idx) => (
                        <div
                          key={idx}
                          className="flex items-center justify-between p-2 rounded-lg bg-secondary/30"
                        >
                          <span className="font-mono text-sm text-muted-foreground">
                            {mp.variables}
                          </span>
                          <span className="font-mono font-semibold">
                            {mp.derivative}
                          </span>
                        </div>
                      ))}
                    </div>
                  </ResultCard>
                )}
              </div>
            )}

            {/* Hessian Matrix for Multi-Variable */}
            {result.variables.length > 1 && result.hessianMatrix.length > 0 && (
              <div
                className="animate-slide-up"
                style={{ animationDelay: "0.2s" }}
              >
                <ResultCard
                  title="Hessian Matrix"
                  icon={<Layers className="h-4 w-4" />}
                  className="glass-card"
                >
                  <div className="space-y-3">
                    <p className="text-sm text-muted-foreground">
                      Matrix of second-order partial derivatives (used for classifying critical points)
                    </p>
                    <div className="overflow-x-auto">
                      <div className="inline-block min-w-full">
                        <div className="flex items-center gap-2">
                          <span className="text-2xl font-light text-muted-foreground">[</span>
                          <div className="flex flex-col gap-1">
                            {result.hessianMatrix.map((row, i) => (
                              <div key={i} className="flex gap-3">
                                {row.map((cell, j) => (
                                  <span
                                    key={j}
                                    className="min-w-[80px] text-center font-mono text-sm p-2 rounded bg-secondary/50"
                                  >
                                    {cell}
                                  </span>
                                ))}
                              </div>
                            ))}
                          </div>
                          <span className="text-2xl font-light text-muted-foreground">]</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </ResultCard>
              </div>
            )}

            {/* Single Variable Derivatives */}
            {result.variables.length === 1 && (
              <div
                className="grid grid-cols-1 md:grid-cols-2 gap-4 animate-slide-up"
                style={{ animationDelay: "0.15s" }}
              >
                <ResultCard
                  title="First Derivative"
                  icon={<Diff className="h-4 w-4" />}
                  className="glass-card"
                >
                  <p className="font-mono text-lg lg:text-xl">
                    {"f'"}({result.variables[0]}) = {result.firstDerivative}
                  </p>
                </ResultCard>

                <ResultCard
                  title="Second Derivative"
                  icon={<Diff className="h-4 w-4" />}
                  className="glass-card"
                >
                  <p className="font-mono text-lg lg:text-xl">
                    {"f''"}({result.variables[0]}) = {result.secondDerivative}
                  </p>
                </ResultCard>
              </div>
            )}

            {/* Graph - Only for single variable functions */}
            {result.variables.length === 1 && result.tableOfValues.length > 0 && (
              <div
                className="animate-slide-up"
                style={{ animationDelay: "0.25s" }}
              >
                <ResultCard title="" className="p-4 lg:p-6 glass-card overflow-hidden">
                  <FunctionGraph
                    data={result.tableOfValues}
                    criticalPoints={result.criticalPoints}
                    inflectionPoints={result.inflectionPoints}
                    functionName={result.originalFunction}
                  />
                </ResultCard>
              </div>
            )}

            {/* Critical Points and Intervals - Only for single variable */}
            {result.variables.length === 1 && (
              <div
                className="grid grid-cols-1 lg:grid-cols-2 gap-4 lg:gap-6 animate-slide-up"
                style={{ animationDelay: "0.3s" }}
              >
                <ResultCard
                  title="Critical Points"
                  icon={<Target className="h-4 w-4" />}
                  className="glass-card"
                >
                  <CriticalPointsDisplay points={result.criticalPoints} />
                </ResultCard>

                <ResultCard
                  title="Intervals"
                  icon={<TrendingUp className="h-4 w-4" />}
                  className="glass-card"
                >
                  <IntervalsDisplay intervals={result.intervals} />
                </ResultCard>
              </div>
            )}

            {/* Inflection Points */}
            {result.inflectionPoints.length > 0 && (
              <div
                className="animate-slide-up"
                style={{ animationDelay: "0.4s" }}
              >
                <ResultCard title="Inflection Points" className="glass-card">
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                    {result.inflectionPoints.map((point, index) => (
                      <div
                        key={index}
                        className="p-4 rounded-xl bg-warning/10 border border-warning/30 hover-lift transition-all duration-300"
                      >
                        <p className="font-mono font-bold text-lg">
                          ({point.x.toFixed(2)}, {point.y.toFixed(2)})
                        </p>
                        <p className="text-sm text-muted-foreground mt-2">
                          {point.explanation}
                        </p>
                      </div>
                    ))}
                  </div>
                </ResultCard>
              </div>
            )}

            {/* Step-by-Step and Table */}
            <div
              className="grid grid-cols-1 lg:grid-cols-2 gap-4 lg:gap-6 animate-slide-up"
              style={{ animationDelay: "0.5s" }}
            >
              <ResultCard title="" className="glass-card">
                <StepExplanation steps={result.steps} />
              </ResultCard>

              <ResultCard title="" className="glass-card">
                <ValuesTable data={result.tableOfValues} />
              </ResultCard>
            </div>
          </div>
        )}

        {/* Compact Empty State */}
        {!result && !error && !isLoading && !showHero && (
          <div className="text-center py-16 animate-slide-up">
            <div className="inline-flex p-4 rounded-2xl bg-primary/10 mb-6 animate-pulse-glow">
              <FunctionSquare className="h-10 w-10 text-primary" />
            </div>
            <h2 className="text-2xl font-bold mb-3">Ready to Analyze</h2>
            <p className="text-muted-foreground">
              Enter a mathematical function above to get started.
            </p>
          </div>
        )}
      </main>

      {/* Footer */}
      <footer className="relative border-t border-border/40 bg-card/30 backdrop-blur-xl mt-auto overflow-hidden">
        {/* Background decoration */}
        <div className="absolute inset-0 -z-10">
          <div className="absolute bottom-0 left-1/4 w-96 h-96 bg-primary/5 rounded-full blur-3xl" />
          <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-accent/5 rounded-full blur-3xl" />
        </div>

        <div className="container mx-auto px-4 py-10 lg:py-16">
          {/* Main Footer Content */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-10 lg:gap-8 items-center">
            {/* Brand Section */}
            <div className="text-center lg:text-left">
              <div className="flex items-center justify-center lg:justify-start gap-3 mb-4">
                <div className="p-2.5 rounded-xl bg-primary/10 glow-border">
                  <FunctionSquare className="h-6 w-6 text-primary" />
                </div>
                <span className="text-xl font-bold text-gradient">
                  Function Analyzer
                </span>
              </div>
              <p className="text-sm text-muted-foreground max-w-xs mx-auto lg:mx-0">
                A powerful mathematical analysis tool built for students and
                educators.
              </p>
            </div>

            {/* Creator Section */}
            <div className="text-center">
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 border border-primary/20 mb-4">
                <GraduationCap className="h-4 w-4 text-primary" />
                <span className="text-sm font-medium">Study Project</span>
              </div>
              <div className="mb-4">
                <p className="text-sm text-muted-foreground mb-1">Created by</p>
                <h3 className="text-2xl lg:text-3xl font-black text-gradient">
                  Rohni Ikhlass
                </h3>
              </div>
              <div className="flex items-center justify-center gap-1 text-sm text-muted-foreground">
                <span>Made with</span>
                <Heart className="h-4 w-4 text-destructive fill-destructive mx-1 animate-pulse" />
                <span>for learning</span>
              </div>
            </div>

            {/* Social Links */}
            <div className="text-center lg:text-right">
              <p className="text-sm text-muted-foreground mb-4">
                Connect with me
              </p>
              <div className="flex items-center justify-center lg:justify-end gap-3">
                <a
                  href="https://github.com/IKHLASSROH"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="social-btn p-3 rounded-xl bg-secondary hover:text-primary-foreground transition-all duration-300"
                  aria-label="GitHub"
                >
                  <Github className="h-5 w-5" />
                </a>
                <a
                  href="https://www.linkedin.com/in/ikhlass-rohni-b74200336/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="social-btn p-3 rounded-xl bg-secondary hover:text-primary-foreground transition-all duration-300"
                  aria-label="LinkedIn"
                >
                  <Linkedin className="h-5 w-5" />
                </a>
                <a
                  href="mailto:bi.rohni@ensta.edu.rohni"
                  className="social-btn p-3 rounded-xl bg-secondary hover:text-primary-foreground transition-all duration-300"
                  aria-label="Email"
                >
                  <Mail className="h-5 w-5" />
                </a>
              </div>
            </div>
          </div>

          {/* Bottom Bar */}
          <div className="mt-10 pt-8 border-t border-border/40">
            <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
              <p className="text-xs text-muted-foreground">
                {new Date().getFullYear()} Function Analyzer. Built for
                educational purposes.
              </p>
              <div className="flex items-center gap-4 text-xs text-muted-foreground">
                <span className="flex items-center gap-1.5">
                  <Code2 className="h-3.5 w-3.5" />
                  Built with Next.js
                </span>
                <span className="flex items-center gap-1.5">
                  <Braces className="h-3.5 w-3.5" />
                  TypeScript
                </span>
              </div>
            </div>
          </div>
        </div>
      </footer>

      {/* History Sidebar */}
      <HistorySidebar
        history={history}
        onSelect={handleHistorySelect}
        onClear={clearHistory}
        isOpen={isHistoryOpen}
        onClose={() => setIsHistoryOpen(false)}
      />
    </div>
  );
}

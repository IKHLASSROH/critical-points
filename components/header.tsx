"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Moon, Sun, Sigma, Zap } from "lucide-react";

export function Header() {
  const [isDark, setIsDark] = useState(true);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const isDarkMode = document.documentElement.classList.contains("dark");
    setIsDark(isDarkMode);

    const handleScroll = () => {
      setScrolled(window.scrollY > 10);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const toggleTheme = () => {
    const newDark = !isDark;
    setIsDark(newDark);
    document.documentElement.classList.toggle("dark", newDark);
  };

  return (
    <header
      className={`sticky top-0 z-50 w-full transition-all duration-500 ${
        scrolled
          ? "bg-background/70 backdrop-blur-2xl border-b shadow-lg shadow-background/10"
          : "bg-transparent"
      }`}
    >
      {/* Animated top accent line */}
      <div className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-primary to-transparent animate-shimmer" />

      <div className="container flex h-16 items-center justify-between">
        <div className="flex items-center gap-4">
          {/* Animated Logo */}
          <div className="relative group cursor-pointer">
            {/* Outer glow ring */}
            <div className="absolute -inset-2 bg-gradient-to-r from-primary via-chart-1 to-primary rounded-2xl opacity-0 group-hover:opacity-70 blur-xl transition-all duration-500 animate-gradient-shift" />
            {/* Rotating border */}
            <div className="absolute -inset-0.5 bg-gradient-to-r from-primary via-chart-1 to-chart-5 rounded-xl opacity-75 group-hover:opacity-100 transition-opacity duration-300 animate-rotate-slow" style={{ animationDuration: '8s' }} />
            {/* Logo container */}
            <div className="relative flex items-center justify-center w-11 h-11 rounded-xl bg-background shadow-2xl transition-transform duration-300 group-hover:scale-105">
              <Sigma className="h-6 w-6 text-primary transition-transform duration-300 group-hover:scale-110" />
            </div>
          </div>

          <div className="space-y-0.5">
            <div className="flex items-center gap-3">
              <h1 className="text-lg font-bold tracking-tight">
                <span className="text-gradient-primary animate-text-gradient">
                  Calculus Analyzer
                </span>
              </h1>
              <span className="hidden sm:flex items-center gap-1.5 px-2.5 py-1 text-[10px] font-bold uppercase tracking-widest bg-gradient-to-r from-primary/20 to-chart-1/20 text-primary rounded-full border border-primary/30 backdrop-blur-sm">
                <Zap className="h-3 w-3" />
                Study Project
              </span>
            </div>
            <p className="text-xs text-muted-foreground tracking-wide">
              by{" "}
              <span className="font-semibold text-foreground/90 hover:text-primary transition-colors cursor-pointer">
                Rohni Ikhlass
              </span>
            </p>
          </div>
        </div>

        <div className="flex items-center gap-4">
          {/* Status indicator */}
          <div className="hidden md:flex items-center gap-2.5 px-4 py-2 text-xs font-medium text-muted-foreground bg-muted/30 rounded-full border border-border/50 backdrop-blur-sm">
            <span className="relative flex h-2.5 w-2.5">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-chart-1 opacity-75" />
              <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-chart-1" />
            </span>
            Multivariable Analysis
          </div>

          {/* Theme toggle with animation */}
          <Button
            variant="outline"
            size="icon"
            onClick={toggleTheme}
            className="relative h-10 w-10 rounded-xl border-border/50 bg-muted/30 backdrop-blur-sm hover:bg-muted/50 hover:border-primary/50 transition-all duration-300 overflow-hidden group"
          >
            <div className="absolute inset-0 bg-gradient-to-tr from-primary/10 to-chart-1/10 opacity-0 group-hover:opacity-100 transition-opacity" />
            {isDark ? (
              <Sun className="h-4 w-4 text-amber-400 transition-transform group-hover:rotate-45 group-hover:scale-110" />
            ) : (
              <Moon className="h-4 w-4 text-primary transition-transform group-hover:-rotate-12 group-hover:scale-110" />
            )}
            <span className="sr-only">Toggle theme</span>
          </Button>
        </div>
      </div>
    </header>
  );
}

"use client";

import { Github, Linkedin, Mail, Heart, Sparkles, GraduationCap, Code2, ExternalLink, ArrowUpRight } from "lucide-react";
import { Button } from "@/components/ui/button";

const techStack = [
  { name: "Next.js 16", color: "from-foreground to-foreground/70" },
  { name: "TypeScript", color: "from-blue-400 to-blue-600" },
  { name: "Math.js", color: "from-emerald-400 to-emerald-600" },
  { name: "Plotly", color: "from-violet-400 to-violet-600" },
  { name: "KaTeX", color: "from-amber-400 to-amber-600" },
  { name: "Tailwind CSS", color: "from-cyan-400 to-cyan-600" },
];

export function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="relative border-t bg-gradient-to-b from-background to-muted/30 overflow-hidden">
      {/* Animated gradient accent line */}
      <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-primary to-transparent" />
      
      {/* Background decorations */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -bottom-32 -left-32 w-96 h-96 bg-primary/5 rounded-full blur-3xl animate-glow-pulse" />
        <div className="absolute -bottom-32 -right-32 w-96 h-96 bg-chart-1/5 rounded-full blur-3xl animate-glow-pulse" style={{ animationDelay: '2s' }} />
      </div>
      
      <div className="container relative py-16">
        <div className="grid gap-12 lg:grid-cols-12">
          {/* Brand Section */}
          <div className="lg:col-span-4 space-y-6">
            <div className="flex items-center gap-4">
              <div className="relative group">
                {/* Animated gradient ring */}
                <div className="absolute -inset-1 bg-gradient-to-r from-primary via-chart-1 to-primary rounded-2xl opacity-50 blur-sm group-hover:opacity-75 transition-opacity animate-gradient-shift" />
                <div className="relative flex items-center justify-center w-14 h-14 rounded-xl bg-background border border-border/50 shadow-xl">
                  <Sparkles className="h-7 w-7 text-primary" />
                </div>
              </div>
              <div>
                <h3 className="text-xl font-bold text-gradient-primary animate-text-gradient">
                  Calculus Analyzer
                </h3>
                <p className="text-sm text-muted-foreground">Multivariable Analysis Tool</p>
              </div>
            </div>
            <p className="text-sm text-muted-foreground leading-relaxed max-w-sm">
              A comprehensive tool for analyzing multivariable functions, computing derivatives, 
              finding critical points, and visualizing mathematical concepts in stunning 3D.
            </p>
            
            {/* Quick stats */}
            <div className="flex gap-6 pt-2">
              <div className="text-center">
                <div className="text-2xl font-bold text-primary">5+</div>
                <div className="text-xs text-muted-foreground">Analysis Types</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-chart-1">3D</div>
                <div className="text-xs text-muted-foreground">Visualization</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-chart-3">Real</div>
                <div className="text-xs text-muted-foreground">Time Analysis</div>
              </div>
            </div>
          </div>

          {/* Study Project Info */}
          <div className="lg:col-span-4 space-y-6">
            <div className="flex items-center gap-3">
              <div className="flex items-center justify-center w-10 h-10 rounded-lg bg-chart-1/10 border border-chart-1/20">
                <GraduationCap className="h-5 w-5 text-chart-1" />
              </div>
              <div>
                <h4 className="font-bold text-lg">Study Project</h4>
                <p className="text-xs text-muted-foreground">Academic Coursework</p>
              </div>
            </div>
            <p className="text-sm text-muted-foreground leading-relaxed">
              This project was developed as part of academic coursework to demonstrate 
              multivariable calculus concepts through interactive visualization and analysis.
            </p>
            
            {/* Tech Stack */}
            <div className="space-y-3">
              <div className="flex items-center gap-2 text-sm font-medium text-muted-foreground">
                <Code2 className="h-4 w-4" />
                <span>Built with</span>
              </div>
              <div className="flex flex-wrap gap-2 stagger-children">
                {techStack.map((tech) => (
                  <span
                    key={tech.name}
                    className="group relative px-3 py-1.5 text-xs font-semibold rounded-lg bg-muted/50 border border-border/50 hover:border-primary/50 transition-all duration-300 cursor-default overflow-hidden"
                  >
                    <span className={`absolute inset-0 bg-gradient-to-r ${tech.color} opacity-0 group-hover:opacity-10 transition-opacity`} />
                    <span className="relative">{tech.name}</span>
                  </span>
                ))}
              </div>
            </div>
          </div>

          {/* Developer Section */}
          <div className="lg:col-span-4 space-y-6">
            <h4 className="font-bold text-lg">Developed By</h4>
            
            {/* Developer Card */}
            <div className="relative group">
              <div className="absolute -inset-0.5 bg-gradient-to-r from-primary via-chart-1 to-chart-5 rounded-2xl opacity-0 group-hover:opacity-50 blur transition-all duration-500" />
              <div className="relative p-5 rounded-xl bg-card/50 border border-border/50 backdrop-blur-sm space-y-4">
                <div className="flex items-center gap-4">
                  {/* Avatar */}
                  <div className="relative">
                    <div className="absolute -inset-1 bg-gradient-to-br from-primary to-chart-1 rounded-full opacity-75 blur-sm" />
                    <div className="relative w-16 h-16 rounded-full bg-gradient-to-br from-primary/20 to-chart-1/20 flex items-center justify-center border-2 border-background shadow-xl">
                      <span className="text-xl font-bold bg-gradient-to-br from-primary to-chart-1 bg-clip-text text-transparent">RI</span>
                    </div>
                    {/* Online indicator */}
                    <div className="absolute -bottom-0.5 -right-0.5 w-5 h-5 bg-chart-1 rounded-full border-3 border-background flex items-center justify-center">
                      <div className="w-2 h-2 bg-background rounded-full" />
                    </div>
                  </div>
                  <div>
                    <p className="text-lg font-bold">Rohni Ikhlass</p>
                    <p className="text-sm text-primary font-medium">CS Student at ENSTA</p>
                  </div>
                </div>
                
                {/* Social Links */}
                <div className="flex items-center gap-2 pt-2">
                  <Button
                    variant="outline"
                    size="sm"
                    className="flex-1 h-10 gap-2 bg-muted/30 border-border/50 hover:bg-primary/10 hover:text-primary hover:border-primary/50 transition-all duration-300 group/btn"
                    asChild
                  >
                    <a
                      href="mailto:bi.rohni@ensta.edu.rohni"
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      <Mail className="h-4 w-4 group-hover/btn:scale-110 transition-transform" />
                      <span className="text-xs font-medium">Email</span>
                    </a>
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    className="flex-1 h-10 gap-2 bg-muted/30 border-border/50 hover:bg-[#0A66C2]/10 hover:text-[#0A66C2] hover:border-[#0A66C2]/50 transition-all duration-300 group/btn"
                    asChild
                  >
                    <a
                      href="https://www.linkedin.com/in/ikhlass-rohni-b74200336/"
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      <Linkedin className="h-4 w-4 group-hover/btn:scale-110 transition-transform" />
                      <span className="text-xs font-medium">LinkedIn</span>
                    </a>
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    className="flex-1 h-10 gap-2 bg-muted/30 border-border/50 hover:bg-foreground/5 hover:border-foreground/30 transition-all duration-300 group/btn"
                    asChild
                  >
                    <a
                      href="https://github.com/IKHLASSROH"
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      <Github className="h-4 w-4 group-hover/btn:scale-110 transition-transform" />
                      <span className="text-xs font-medium">GitHub</span>
                    </a>
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="mt-16 pt-8 border-t border-border/50">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <span>&copy; {currentYear}</span>
              <span className="w-1 h-1 rounded-full bg-muted-foreground/50" />
              <span className="font-semibold text-foreground">Rohni Ikhlass</span>
              <span className="hidden sm:inline w-1 h-1 rounded-full bg-muted-foreground/50" />
              <span className="hidden sm:inline">All rights reserved</span>
            </div>
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <span>Crafted with</span>
              <Heart className="h-4 w-4 text-chart-2 fill-chart-2 animate-pulse" />
              <span>for learning calculus</span>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}

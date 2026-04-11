import { Header } from "@/components/header";
import { Footer } from "@/components/footer";
import { FunctionAnalyzer } from "@/components/function-analyzer";
import { Sparkles, Zap, TrendingUp, Boxes, GraduationCap, ChevronDown } from "lucide-react";

const features = [
  { 
    label: "Partial Derivatives", 
    icon: TrendingUp,
    description: "First & second order",
    gradient: "from-chart-4 to-chart-5" 
  },
  { 
    label: "Critical Points", 
    icon: Sparkles,
    description: "Automatic detection",
    gradient: "from-chart-1 to-emerald-400" 
  },
  { 
    label: "Hessian Matrix", 
    icon: Boxes,
    description: "Full analysis",
    gradient: "from-chart-3 to-amber-400" 
  },
  { 
    label: "3D Visualization", 
    icon: Zap,
    description: "Interactive plots",
    gradient: "from-primary to-violet-400" 
  },
  { 
    label: "Step-by-Step", 
    icon: GraduationCap,
    description: "Learn the process",
    gradient: "from-chart-2 to-rose-400" 
  },
];

export default function Home() {
  return (
    <div className="min-h-screen flex flex-col bg-background noise-overlay">
      {/* Premium Background */}
      <div className="fixed inset-0 -z-10 overflow-hidden pointer-events-none">
        {/* Main gradient orbs */}
        <div className="absolute top-0 left-1/4 w-[600px] h-[600px] bg-primary/10 rounded-full blur-[120px] animate-float" />
        <div className="absolute bottom-1/4 right-1/4 w-[500px] h-[500px] bg-chart-1/10 rounded-full blur-[100px] animate-float-delayed" />
        <div className="absolute top-1/3 right-1/3 w-[400px] h-[400px] bg-chart-5/8 rounded-full blur-[80px] animate-glow-pulse" />
        
        {/* Grid pattern overlay */}
        <div className="absolute inset-0 grid-pattern opacity-30" />
        
        {/* Center radial glow */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[1000px] h-[1000px] bg-gradient-radial from-primary/5 via-transparent to-transparent rounded-full" />
      </div>

      <Header />
      
      <main className="flex-1 container py-12 md:py-20">
        <div className="max-w-5xl mx-auto space-y-16">
          {/* Hero Section */}
          <div className="text-center space-y-8 animate-slide-up">
            {/* Badge */}
            <div className="inline-flex items-center gap-2 px-5 py-2 text-sm font-semibold bg-gradient-to-r from-primary/15 via-chart-1/15 to-primary/15 text-primary rounded-full border border-primary/25 backdrop-blur-sm shadow-lg shadow-primary/10 animate-border-flow">
              <Sparkles className="h-4 w-4" />
              Multivariable Calculus Made Visual
              <Sparkles className="h-4 w-4" />
            </div>
            
            {/* Main Heading */}
            <div className="space-y-4">
              <h2 className="text-4xl sm:text-5xl md:text-6xl font-extrabold tracking-tight text-balance leading-[1.1]">
                <span className="text-foreground">Analyze Functions in</span>
                <br />
                <span className="text-gradient-primary animate-text-gradient text-glow">
                  Two Variables
                </span>
              </h2>
              <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto text-pretty leading-relaxed">
                Compute partial derivatives, find critical points, classify them
                using the Hessian matrix, and visualize surfaces in 3D.{" "}
                <span className="text-foreground font-semibold">
                  Perfect for learning multivariable calculus.
                </span>
              </p>
            </div>

            {/* Feature Pills */}
            <div className="flex flex-wrap justify-center gap-3 pt-4 stagger-children">
              {features.map((feature) => {
                const Icon = feature.icon;
                return (
                  <div
                    key={feature.label}
                    className="group relative"
                  >
                    <div className={`absolute -inset-0.5 bg-gradient-to-r ${feature.gradient} rounded-xl opacity-0 group-hover:opacity-50 blur transition-all duration-300`} />
                    <div className="relative flex items-center gap-2.5 px-4 py-2.5 bg-card/80 backdrop-blur-sm rounded-xl border border-border/50 hover:border-primary/50 transition-all duration-300 cursor-default">
                      <div className={`flex items-center justify-center w-8 h-8 rounded-lg bg-gradient-to-br ${feature.gradient} shadow-lg`}>
                        <Icon className="h-4 w-4 text-white" />
                      </div>
                      <div className="text-left">
                        <div className="text-sm font-semibold text-foreground">{feature.label}</div>
                        <div className="text-xs text-muted-foreground">{feature.description}</div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
            
            {/* Scroll indicator */}
            <div className="pt-8 animate-bounce">
              <ChevronDown className="h-6 w-6 mx-auto text-muted-foreground" />
            </div>
          </div>

          {/* Main Analyzer with glass effect */}
          <div className="relative animate-scale-in" style={{ animationDelay: '0.3s' }}>
            <div className="absolute -inset-4 bg-gradient-to-r from-primary/20 via-chart-1/20 to-chart-5/20 rounded-3xl blur-2xl opacity-50" />
            <div className="relative">
              <FunctionAnalyzer />
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}

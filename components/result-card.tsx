"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { cn } from "@/lib/utils";

interface ResultCardProps {
  title: string;
  children: React.ReactNode;
  icon?: React.ReactNode;
  className?: string;
  variant?: "default" | "highlight" | "success" | "warning";
}

export function ResultCard({
  title,
  children,
  icon,
  className,
  variant = "default",
}: ResultCardProps) {
  return (
    <Card
      className={cn(
        "transition-all duration-300 hover:shadow-xl hover:shadow-primary/5 border-border/50 overflow-hidden group",
        variant === "highlight" && "border-primary/30 bg-primary/5 hover:border-primary/50",
        variant === "success" && "border-success/30 bg-success/5 hover:border-success/50",
        variant === "warning" && "border-warning/30 bg-warning/5 hover:border-warning/50",
        className
      )}
    >
      {title && (
        <CardHeader className="pb-3">
          <CardTitle className="flex items-center gap-2 text-base font-semibold">
            {icon && (
              <span className="text-primary transition-transform duration-300 group-hover:scale-110">
                {icon}
              </span>
            )}
            {title}
          </CardTitle>
        </CardHeader>
      )}
      <CardContent className={!title ? "pt-6" : ""}>{children}</CardContent>
    </Card>
  );
}

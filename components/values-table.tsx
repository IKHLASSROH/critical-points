"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { ChevronDown, ChevronUp, TableIcon, Hash, Calculator } from "lucide-react";

interface ValuesTableProps {
  data: { x: number; y: number }[];
}

export function ValuesTable({ data }: ValuesTableProps) {
  const [isExpanded, setIsExpanded] = useState(false);

  // Sample data points for display
  const sampledData = data.filter((_, index) => index % 4 === 0);
  const displayData = isExpanded ? sampledData : sampledData.slice(0, 10);

  // Calculate some stats
  const yValues = data.map((d) => d.y).filter((y) => isFinite(y));
  const minY = Math.min(...yValues);
  const maxY = Math.max(...yValues);

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-lg bg-accent/20">
            <TableIcon className="h-5 w-5 text-accent-foreground" />
          </div>
          <div>
            <h3 className="text-lg font-bold">Table of Values</h3>
            <p className="text-xs text-muted-foreground">{sampledData.length} data points</p>
          </div>
        </div>
        <div className="hidden sm:flex items-center gap-2 text-xs">
          <span className="px-2 py-1 rounded-full bg-success/10 border border-success/20 font-mono">
            min: {minY.toFixed(2)}
          </span>
          <span className="px-2 py-1 rounded-full bg-destructive/10 border border-destructive/20 font-mono">
            max: {maxY.toFixed(2)}
          </span>
        </div>
      </div>

      <ScrollArea className="h-[280px] rounded-xl border border-border/50 bg-card/50">
        <Table>
          <TableHeader className="sticky top-0 bg-card/95 backdrop-blur-sm z-10">
            <TableRow className="hover:bg-transparent">
              <TableHead className="font-bold text-foreground">
                <div className="flex items-center gap-2">
                  <Hash className="h-3.5 w-3.5 text-muted-foreground" />
                  x
                </div>
              </TableHead>
              <TableHead className="font-bold text-foreground">
                <div className="flex items-center gap-2">
                  <Calculator className="h-3.5 w-3.5 text-muted-foreground" />
                  f(x)
                </div>
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {displayData.map((row, index) => {
              const isMin = row.y === minY;
              const isMax = row.y === maxY;
              return (
                <TableRow
                  key={index}
                  className={`font-mono text-sm transition-colors ${isMin ? "bg-success/5" : isMax ? "bg-destructive/5" : ""}`}
                >
                  <TableCell className="text-muted-foreground py-2.5">
                    {row.x.toFixed(2)}
                  </TableCell>
                  <TableCell
                    className={`py-2.5 ${isMin ? "text-success font-semibold" : isMax ? "text-destructive font-semibold" : "text-foreground"}`}
                  >
                    {row.y.toFixed(4)}
                    {isMin && (
                      <span className="ml-2 text-[10px] px-1.5 py-0.5 rounded bg-success/20 text-success">
                        MIN
                      </span>
                    )}
                    {isMax && (
                      <span className="ml-2 text-[10px] px-1.5 py-0.5 rounded bg-destructive/20 text-destructive">
                        MAX
                      </span>
                    )}
                  </TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </ScrollArea>

      {sampledData.length > 10 && (
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
              Show All {sampledData.length} Values
            </>
          )}
        </Button>
      )}
    </div>
  );
}

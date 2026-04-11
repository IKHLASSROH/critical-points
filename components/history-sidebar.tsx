"use client";

import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { History, X, Trash2 } from "lucide-react";
import { cn } from "@/lib/utils";

interface HistoryItem {
  id: string;
  function: string;
  timestamp: Date;
}

interface HistorySidebarProps {
  history: HistoryItem[];
  onSelect: (fn: string) => void;
  onClear: () => void;
  isOpen: boolean;
  onClose: () => void;
}

export function HistorySidebar({
  history,
  onSelect,
  onClear,
  isOpen,
  onClose,
}: HistorySidebarProps) {
  return (
    <>
      {/* Overlay for mobile */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-background/80 backdrop-blur-sm z-40 lg:hidden"
          onClick={onClose}
        />
      )}

      {/* Sidebar */}
      <aside
        className={cn(
          "fixed right-0 top-0 h-full w-80 bg-card border-l border-border z-50 transform transition-transform duration-300 ease-in-out",
          isOpen ? "translate-x-0" : "translate-x-full"
        )}
      >
        <div className="flex items-center justify-between p-4 border-b border-border">
          <div className="flex items-center gap-2">
            <History className="h-5 w-5 text-primary" />
            <h2 className="font-semibold">History</h2>
          </div>
          <div className="flex items-center gap-2">
            {history.length > 0 && (
              <Button
                variant="ghost"
                size="icon"
                onClick={onClear}
                className="h-8 w-8 text-muted-foreground hover:text-destructive"
              >
                <Trash2 className="h-4 w-4" />
                <span className="sr-only">Clear history</span>
              </Button>
            )}
            <Button
              variant="ghost"
              size="icon"
              onClick={onClose}
              className="h-8 w-8"
            >
              <X className="h-4 w-4" />
              <span className="sr-only">Close</span>
            </Button>
          </div>
        </div>

        <ScrollArea className="h-[calc(100%-65px)]">
          <div className="p-4 space-y-2">
            {history.length === 0 ? (
              <p className="text-muted-foreground text-sm text-center py-8">
                No analysis history yet
              </p>
            ) : (
              history.map((item) => (
                <button
                  key={item.id}
                  onClick={() => {
                    onSelect(item.function);
                    onClose();
                  }}
                  className="w-full text-left p-3 rounded-lg bg-secondary/50 hover:bg-secondary transition-colors duration-200 group"
                >
                  <p className="font-mono text-sm truncate group-hover:text-primary transition-colors">
                    f(x) = {item.function}
                  </p>
                  <p className="text-xs text-muted-foreground mt-1">
                    {item.timestamp.toLocaleTimeString()}
                  </p>
                </button>
              ))
            )}
          </div>
        </ScrollArea>
      </aside>
    </>
  );
}

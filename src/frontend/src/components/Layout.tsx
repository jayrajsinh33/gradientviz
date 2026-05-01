import { Badge } from "@/components/ui/badge";
import { Brain, TrendingDown } from "lucide-react";
import type { ReactNode } from "react";

interface LayoutProps {
  children: ReactNode;
}

export function Layout({ children }: LayoutProps) {
  return (
    <div className="min-h-screen bg-background flex flex-col">
      {/* Header */}
      <header className="bg-card border-b border-border shadow-subtle sticky top-0 z-50">
        <div className="max-w-screen-2xl mx-auto px-4 md:px-6 h-14 flex items-center justify-between gap-4">
          <div className="flex items-center gap-3 min-w-0">
            <div className="flex-shrink-0 w-8 h-8 rounded-lg bg-primary/20 border border-primary/30 flex items-center justify-center">
              <TrendingDown className="w-4 h-4 text-primary" />
            </div>
            <div className="flex items-center gap-2 min-w-0">
              <span className="font-display font-semibold text-foreground text-base leading-none truncate">
                Gradient Descent
              </span>
              <Badge
                variant="secondary"
                className="hidden sm:inline-flex text-xs bg-accent/15 text-accent border-accent/25 font-mono"
              >
                ML Visualizer
              </Badge>
            </div>
          </div>

          <div className="flex items-center gap-2 text-muted-foreground text-sm">
            <Brain className="w-4 h-4 text-primary flex-shrink-0" />
            <span className="hidden md:inline font-body text-xs">
              Minimize loss · Update weights · Visualize convergence
            </span>
          </div>
        </div>
      </header>

      {/* Main content */}
      <main className="flex-1 flex flex-col">{children}</main>

      {/* Footer */}
      <footer className="bg-muted/40 border-t border-border py-3 px-4 md:px-6">
        <div className="max-w-screen-2xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-1 text-xs text-muted-foreground font-body">
          <span>
            © {new Date().getFullYear()}. Built with love using{" "}
            <a
              href={`https://caffeine.ai?utm_source=caffeine-footer&utm_medium=referral&utm_content=${encodeURIComponent(
                typeof window !== "undefined" ? window.location.hostname : "",
              )}`}
              target="_blank"
              rel="noopener noreferrer"
              className="text-primary hover:text-primary/80 transition-colors duration-200"
            >
              caffeine.ai
            </a>
          </span>
          <span className="hidden sm:inline opacity-60">
            Gradient Descent · Educational ML Visualizer
          </span>
        </div>
      </footer>
    </div>
  );
}

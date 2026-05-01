import type { ConvergenceStatus } from "@/types/simulation";
import { Activity, AlertTriangle, CheckCircle2 } from "lucide-react";

interface MetricsPanelProps {
  loss: number;
  w1: number;
  w2: number;
  gradientMagnitude: number;
  iteration: number;
  convergenceStatus: ConvergenceStatus;
}

function MetricRow({
  label,
  value,
  ocid,
  highlight,
}: {
  label: string;
  value: string;
  ocid: string;
  highlight?: "primary" | "accent" | "warning" | "muted";
}) {
  const colorMap = {
    primary: "text-primary",
    accent: "text-accent",
    warning: "text-[oklch(0.75_0.18_85)]",
    muted: "text-muted-foreground",
  };
  const colorClass = highlight ? colorMap[highlight] : "text-foreground";
  return (
    <div className="flex items-center justify-between py-1.5 border-b border-border/40 last:border-0">
      <span className="text-xs text-muted-foreground font-body">{label}</span>
      <span
        data-ocid={ocid}
        className={`text-sm font-mono font-semibold ${colorClass}`}
      >
        {value}
      </span>
    </div>
  );
}

export function MetricsPanel({
  loss,
  w1,
  w2,
  gradientMagnitude,
  iteration,
  convergenceStatus,
}: MetricsPanelProps) {
  const isConverged = convergenceStatus === "converged";
  const isDiverging = convergenceStatus === "diverging";

  return (
    <div className="flex flex-col gap-3">
      {/* Convergence badge */}
      <div
        data-ocid="simulation.convergence_status"
        className={`flex items-center gap-2 px-3 py-2 rounded-lg border text-xs font-display font-semibold transition-smooth ${
          isConverged
            ? "bg-accent/15 border-accent/40 text-accent"
            : isDiverging
              ? "bg-destructive/15 border-destructive/40 text-destructive"
              : convergenceStatus === "running"
                ? "bg-primary/10 border-primary/30 text-primary"
                : "bg-muted/50 border-border text-muted-foreground"
        }`}
      >
        {isConverged ? (
          <CheckCircle2 className="w-4 h-4" />
        ) : isDiverging ? (
          <AlertTriangle className="w-4 h-4" />
        ) : (
          <Activity className="w-4 h-4" />
        )}
        {isConverged
          ? "Converged! Loss < 0.01"
          : isDiverging
            ? "Diverging — reduce learning rate"
            : convergenceStatus === "running"
              ? "Descending…"
              : "Ready to run"}
      </div>

      {/* Metrics */}
      <div className="bg-card/60 border border-border rounded-lg px-3 py-1">
        <MetricRow
          label="Current Loss"
          value={loss.toFixed(5)}
          ocid="simulation.loss_value"
          highlight={
            isConverged ? "accent" : loss < 0.1 ? "primary" : undefined
          }
        />
        <MetricRow
          label="w₁ (weight 1)"
          value={w1.toFixed(4)}
          ocid="simulation.w1_value"
          highlight="primary"
        />
        <MetricRow
          label="w₂ (weight 2)"
          value={w2.toFixed(4)}
          ocid="simulation.w2_value"
          highlight="primary"
        />
        <MetricRow
          label="‖∇L‖ Gradient Magnitude"
          value={gradientMagnitude.toFixed(4)}
          ocid="simulation.gradient_magnitude"
          highlight={gradientMagnitude < 0.01 ? "accent" : "warning"}
        />
        <MetricRow
          label="Iteration"
          value={String(iteration)}
          ocid="simulation.iteration_value"
          highlight="muted"
        />
      </div>

      <p className="text-[11px] text-muted-foreground leading-snug">
        The gradient magnitude tells us how steep the slope is. When it
        approaches zero, the weights have found a minimum of the loss surface.
      </p>
    </div>
  );
}

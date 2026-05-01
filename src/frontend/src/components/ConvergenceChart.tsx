import type { LossEntry } from "@/types/simulation";
import type { ConvergenceStatus } from "@/types/simulation";
import {
  CartesianGrid,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

interface ConvergenceChartProps {
  lossHistory: LossEntry[];
  convergenceStatus: ConvergenceStatus;
}

interface TooltipPayload {
  value: number;
  dataKey: string;
}

interface CustomTooltipProps {
  active?: boolean;
  payload?: TooltipPayload[];
  label?: number;
}

function CustomTooltip({ active, payload, label }: CustomTooltipProps) {
  if (!active || !payload?.length) return null;
  return (
    <div className="bg-card border border-border rounded-lg px-3 py-2 shadow-elevation text-xs font-mono">
      <p className="text-muted-foreground">Iter {label}</p>
      <p className="text-accent font-semibold">
        Loss: {payload[0].value.toFixed(5)}
      </p>
    </div>
  );
}

export function ConvergenceChart({
  lossHistory,
  convergenceStatus,
}: ConvergenceChartProps) {
  // Down-sample if many points for performance
  const displayData =
    lossHistory.length > 100
      ? lossHistory.filter(
          (_, i) =>
            i % Math.ceil(lossHistory.length / 100) === 0 ||
            i === lossHistory.length - 1,
        )
      : lossHistory;

  const lineColor =
    convergenceStatus === "converged"
      ? "oklch(0.68 0.22 145)"
      : convergenceStatus === "diverging"
        ? "oklch(0.55 0.22 25)"
        : "oklch(0.72 0.2 265)";

  const lastLoss = lossHistory[lossHistory.length - 1]?.loss ?? 1;
  const yMax = Math.max(lastLoss * 1.1, 0.05);
  const firstLoss = lossHistory[0]?.loss ?? 1;

  return (
    <div className="w-full h-full flex flex-col">
      <ResponsiveContainer width="100%" height="100%">
        <LineChart
          data={displayData}
          margin={{ top: 4, right: 8, left: -10, bottom: 0 }}
        >
          <CartesianGrid
            strokeDasharray="3 3"
            stroke="rgba(255,255,255,0.05)"
          />
          <XAxis
            dataKey="iteration"
            tick={{
              fontSize: 10,
              fill: "rgba(180,180,200,0.6)",
              fontFamily: "monospace",
            }}
            label={{
              value: "Iteration",
              position: "insideBottom",
              offset: -2,
              style: { fontSize: 10, fill: "rgba(180,180,200,0.5)" },
            }}
          />
          <YAxis
            domain={[0, Math.max(firstLoss * 1.05, yMax)]}
            tick={{
              fontSize: 10,
              fill: "rgba(180,180,200,0.6)",
              fontFamily: "monospace",
            }}
            tickFormatter={(v: number) => v.toFixed(2)}
            label={{
              value: "Loss",
              angle: -90,
              position: "insideLeft",
              offset: 14,
              style: { fontSize: 10, fill: "rgba(180,180,200,0.5)" },
            }}
          />
          <Tooltip content={<CustomTooltip />} />
          <Line
            type="monotone"
            dataKey="loss"
            stroke={lineColor}
            strokeWidth={2}
            dot={false}
            isAnimationActive={false}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}

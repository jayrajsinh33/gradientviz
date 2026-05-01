import { ConvergenceChart } from "@/components/ConvergenceChart";
import { LossSurfaceCanvas } from "@/components/LossSurfaceCanvas";
import { MetricsPanel } from "@/components/MetricsPanel";
import { SimulationControls } from "@/components/SimulationControls";
import { useSimulation } from "@/hooks/useSimulation";
import { useEffect, useRef } from "react";

export function VisualizerPage() {
  const {
    w1,
    w2,
    iteration,
    loss,
    gradientMagnitude,
    lossHistory,
    convergenceStatus,
    isRunning,
    learningRate,
    initialW1,
    initialW2,
    lossSurface,
    gradW1Dir,
    gradW2Dir,
    step,
    play,
    pause,
    reset,
    setLearningRate,
    setInitialWeights,
  } = useSimulation();

  // Track position history for path drawing
  const posHistoryRef = useRef<{ w1: number; w2: number }[]>([{ w1, w2 }]);
  const lastIterRef = useRef(iteration);

  useEffect(() => {
    if (iteration !== lastIterRef.current) {
      posHistoryRef.current = [...posHistoryRef.current, { w1, w2 }];
      if (posHistoryRef.current.length > 300) {
        posHistoryRef.current = posHistoryRef.current.slice(-300);
      }
      lastIterRef.current = iteration;
    }
  }, [w1, w2, iteration]);

  // Reset path history on reset (iteration goes back to 0)
  useEffect(() => {
    if (iteration === 0) {
      posHistoryRef.current = [{ w1, w2 }];
      lastIterRef.current = 0;
    }
    // w1 and w2 intentionally omitted — we only want to seed the initial position on reset, not track every update
    // biome-ignore lint/correctness/useExhaustiveDependencies: seed only on reset
  }, [iteration, w1, w2]);

  return (
    <div
      data-ocid="visualizer.page"
      className="flex-1 flex flex-col p-3 md:p-4 gap-3 md:gap-4 bg-background"
    >
      {/* Page title row */}
      <div className="flex flex-col gap-0.5">
        <h1 className="font-display font-bold text-xl md:text-2xl text-foreground leading-tight">
          Gradient Descent Visualization
        </h1>
        <p className="text-xs text-muted-foreground font-body">
          Watch how gradient descent navigates the loss surface to find minimum
          error in a 2-parameter model.
        </p>
      </div>

      {/* Main grid: desktop = [60% canvas | 40% right panel], mobile = stacked */}
      <div className="flex-1 grid grid-cols-1 lg:grid-cols-[3fr_2fr] gap-3 md:gap-4 min-h-0">
        {/* Left: Loss Surface Canvas */}
        <div
          data-ocid="visualizer.loss_surface_panel"
          className="bg-card border border-border rounded-xl overflow-hidden flex flex-col shadow-elevation"
        >
          <div className="px-4 pt-3 pb-2 border-b border-border/50 bg-card">
            <h2 className="font-display font-semibold text-sm text-foreground">
              2D Loss Surface Visualization
            </h2>
            <p className="text-[11px] text-muted-foreground mt-0.5">
              Heatmap of loss(w₁, w₂) — warm colors = high loss, cool = low.
              White dot shows current weights.
            </p>
          </div>
          <div className="flex-1 p-2 min-h-[280px] md:min-h-[360px]">
            <LossSurfaceCanvas
              lossSurface={lossSurface}
              w1={w1}
              w2={w2}
              gradW1Dir={gradW1Dir}
              gradW2Dir={gradW2Dir}
              posHistory={posHistoryRef.current}
            />
          </div>
          <div className="px-4 pb-3 pt-1">
            <p className="text-[10px] text-muted-foreground font-body leading-relaxed">
              <span className="text-[oklch(0.75_0.18_85)] font-semibold">
                Yellow arrow
              </span>{" "}
              = gradient direction (steepest ascent). Descent moves opposite.
              <span className="text-[oklch(0.72_0.13_235)] font-semibold">
                {" "}
                Dashed path
              </span>{" "}
              = trajectory of weights across iterations.
            </p>
          </div>
        </div>

        {/* Right: Chart + Controls + Metrics */}
        <div className="flex flex-col gap-3 md:gap-4 min-h-0">
          {/* Convergence Chart */}
          <div
            data-ocid="visualizer.convergence_chart_panel"
            className="bg-card border border-border rounded-xl overflow-hidden flex flex-col shadow-elevation"
          >
            <div className="px-4 pt-3 pb-2 border-b border-border/50">
              <h2 className="font-display font-semibold text-sm text-foreground">
                Convergence Chart
              </h2>
              <p className="text-[11px] text-muted-foreground mt-0.5">
                Loss vs. iteration — the curve should descend and flatten as the
                model learns.
              </p>
            </div>
            <div className="flex-1 min-h-[180px] md:min-h-[200px] p-2 pb-6">
              <ConvergenceChart
                lossHistory={lossHistory}
                convergenceStatus={convergenceStatus}
              />
            </div>
          </div>

          {/* Controls */}
          <div
            data-ocid="visualizer.controls_panel"
            className="bg-card border border-border rounded-xl p-4 shadow-elevation"
          >
            <h2 className="font-display font-semibold text-sm text-foreground mb-3">
              Simulation Controls
            </h2>
            <SimulationControls
              isRunning={isRunning}
              learningRate={learningRate}
              iteration={iteration}
              initialW1={initialW1}
              initialW2={initialW2}
              onPlay={play}
              onPause={pause}
              onStep={step}
              onReset={reset}
              onLearningRateChange={setLearningRate}
              onInitialWeightsChange={setInitialWeights}
            />
          </div>

          {/* Metrics Panel */}
          <div
            data-ocid="visualizer.metrics_panel"
            className="bg-card border border-border rounded-xl p-4 shadow-elevation"
          >
            <h2 className="font-display font-semibold text-sm text-foreground mb-3">
              Live Metrics
            </h2>
            <MetricsPanel
              loss={loss}
              w1={w1}
              w2={w2}
              gradientMagnitude={gradientMagnitude}
              iteration={iteration}
              convergenceStatus={convergenceStatus}
            />
          </div>
        </div>
      </div>
    </div>
  );
}

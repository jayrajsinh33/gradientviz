import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import { Pause, Play, RotateCcw, SkipForward } from "lucide-react";

interface SimulationControlsProps {
  isRunning: boolean;
  learningRate: number;
  iteration: number;
  initialW1: number;
  initialW2: number;
  onPlay: () => void;
  onPause: () => void;
  onStep: () => void;
  onReset: () => void;
  onLearningRateChange: (lr: number) => void;
  onInitialWeightsChange: (w1: number, w2: number) => void;
}

const LR_MIN = 0.001;
const LR_MAX = 1.0;
const LR_STEPS = 1000;

// Linear slider value → actual learning rate (log scale)
function sliderToLR(v: number): number {
  const logMin = Math.log10(LR_MIN);
  const logMax = Math.log10(LR_MAX);
  return 10 ** (logMin + (v / LR_STEPS) * (logMax - logMin));
}

function lrToSlider(lr: number): number {
  const logMin = Math.log10(LR_MIN);
  const logMax = Math.log10(LR_MAX);
  return ((Math.log10(lr) - logMin) / (logMax - logMin)) * LR_STEPS;
}

export function SimulationControls({
  isRunning,
  learningRate,
  iteration,
  initialW1,
  initialW2,
  onPlay,
  onPause,
  onStep,
  onReset,
  onLearningRateChange,
  onInitialWeightsChange,
}: SimulationControlsProps) {
  const sliderVal = lrToSlider(learningRate);

  return (
    <div className="flex flex-col gap-4">
      {/* Playback controls */}
      <div className="flex items-center gap-2 flex-wrap">
        <Button
          data-ocid="simulation.play_pause_button"
          variant={isRunning ? "secondary" : "default"}
          size="sm"
          onClick={isRunning ? onPause : onPlay}
          className="gap-2 font-display font-medium transition-smooth"
        >
          {isRunning ? (
            <>
              <Pause className="w-4 h-4" /> Pause
            </>
          ) : (
            <>
              <Play className="w-4 h-4" /> Play
            </>
          )}
        </Button>
        <Button
          data-ocid="simulation.step_button"
          variant="outline"
          size="sm"
          onClick={onStep}
          disabled={isRunning}
          className="gap-2 font-display font-medium transition-smooth"
        >
          <SkipForward className="w-4 h-4" /> Step
        </Button>
        <Button
          data-ocid="simulation.reset_button"
          variant="outline"
          size="sm"
          onClick={onReset}
          className="gap-2 font-display font-medium text-destructive border-destructive/30 hover:bg-destructive/10 transition-smooth"
        >
          <RotateCcw className="w-4 h-4" /> Reset
        </Button>
        <span
          data-ocid="simulation.iteration_counter"
          className="ml-auto text-xs font-mono text-muted-foreground bg-muted/60 px-2 py-1 rounded-md"
        >
          Iteration:{" "}
          <span className="text-foreground font-semibold">{iteration}</span>
        </span>
      </div>

      {/* Learning rate slider */}
      <div className="flex flex-col gap-2">
        <div className="flex items-center justify-between text-xs">
          <label
            htmlFor="lr-slider"
            className="font-display font-medium text-foreground/80"
          >
            Learning Rate (α)
          </label>
          <span
            data-ocid="simulation.learning_rate_display"
            className="font-mono text-primary bg-primary/10 px-2 py-0.5 rounded text-xs"
          >
            {learningRate.toFixed(4)}
          </span>
        </div>
        <Slider
          id="lr-slider"
          data-ocid="simulation.learning_rate_slider"
          value={[sliderVal]}
          min={0}
          max={LR_STEPS}
          step={1}
          onValueChange={([v]) => onLearningRateChange(sliderToLR(v))}
          className="w-full"
        />
        <div className="flex justify-between text-[10px] text-muted-foreground font-mono">
          <span>{LR_MIN}</span>
          <span>0.01</span>
          <span>0.1</span>
          <span>{LR_MAX}</span>
        </div>
        <p className="text-[11px] text-muted-foreground leading-snug">
          Controls how large each weight update step is. Too high → diverges.
          Too low → slow convergence.
        </p>
      </div>

      {/* Initial weights sliders */}
      <div className="flex flex-col gap-2">
        <label
          htmlFor="w1-slider"
          className="text-xs font-display font-medium text-foreground/80"
        >
          Starting Position (w₁, w₂)
        </label>
        <div className="flex items-center gap-3">
          <span className="text-[10px] font-mono text-muted-foreground w-5">
            w₁
          </span>
          <Slider
            id="w1-slider"
            data-ocid="simulation.initial_w1_slider"
            value={[initialW1]}
            min={-2}
            max={2}
            step={0.1}
            onValueChange={([v]) => onInitialWeightsChange(v, initialW2)}
            className="flex-1"
          />
          <span className="text-[10px] font-mono text-muted-foreground w-10 text-right">
            {initialW1.toFixed(1)}
          </span>
        </div>
        <div className="flex items-center gap-3">
          <span className="text-[10px] font-mono text-muted-foreground w-5">
            w₂
          </span>
          <Slider
            data-ocid="simulation.initial_w2_slider"
            value={[initialW2]}
            min={-2}
            max={2}
            step={0.1}
            onValueChange={([v]) => onInitialWeightsChange(initialW1, v)}
            className="flex-1"
          />
          <span className="text-[10px] font-mono text-muted-foreground w-10 text-right">
            {initialW2.toFixed(1)}
          </span>
        </div>
        <p className="text-[11px] text-muted-foreground leading-snug">
          Initial weight values — the starting point on the loss surface.
          Different starts may find different paths to the minimum.
        </p>
      </div>
    </div>
  );
}

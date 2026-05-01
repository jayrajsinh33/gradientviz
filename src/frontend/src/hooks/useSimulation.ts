import type {
  ConvergenceStatus,
  LossEntry,
  LossSurfacePoint,
  StepResult,
} from "@/types/simulation";
import { useCallback, useEffect, useRef, useState } from "react";

// Loss function: bowl-shaped with secondary ridge for visual interest
// f(w1, w2) = 0.5*(w1^2 + 2*w2^2) + 0.1*sin(3*w1)*cos(2*w2)
function lossFunction(w1: number, w2: number): number {
  return (
    0.5 * (w1 * w1 + 2 * w2 * w2) + 0.1 * Math.sin(3 * w1) * Math.cos(2 * w2)
  );
}

function gradW1(w1: number, w2: number): number {
  return w1 + 0.3 * Math.cos(3 * w1) * Math.cos(2 * w2);
}

function gradW2(w1: number, w2: number): number {
  return 4 * w2 - 0.2 * Math.sin(3 * w1) * Math.sin(2 * w2);
}

export const GRID_SIZE = 40;
const W_RANGE = 2.0;

export function computeLossSurface(): LossSurfacePoint[] {
  const points: LossSurfacePoint[] = [];
  for (let i = 0; i < GRID_SIZE; i++) {
    for (let j = 0; j < GRID_SIZE; j++) {
      const w1 = -W_RANGE + (i / (GRID_SIZE - 1)) * 2 * W_RANGE;
      const w2 = -W_RANGE + (j / (GRID_SIZE - 1)) * 2 * W_RANGE;
      points.push({ w1, w2, loss: lossFunction(w1, w2) });
    }
  }
  return points;
}

interface SimulationHookState {
  w1: number;
  w2: number;
  iteration: number;
  loss: number;
  gradientMagnitude: number;
  lossHistory: LossEntry[];
  convergenceStatus: ConvergenceStatus;
  isRunning: boolean;
  learningRate: number;
  initialW1: number;
  initialW2: number;
  lossSurface: LossSurfacePoint[];
  gradW1Dir: number;
  gradW2Dir: number;
}

const DEFAULT_W1 = 1.5;
const DEFAULT_W2 = 1.5;
const DEFAULT_LR = 0.1;

function makeInitialState(w1: number, w2: number): SimulationHookState {
  const loss = lossFunction(w1, w2);
  const gw1 = gradW1(w1, w2);
  const gw2 = gradW2(w1, w2);
  return {
    w1,
    w2,
    iteration: 0,
    loss,
    gradientMagnitude: Math.sqrt(gw1 * gw1 + gw2 * gw2),
    lossHistory: [{ iteration: 0, loss }],
    convergenceStatus: "idle",
    isRunning: false,
    learningRate: DEFAULT_LR,
    initialW1: w1,
    initialW2: w2,
    lossSurface: computeLossSurface(),
    gradW1Dir: gw1,
    gradW2Dir: gw2,
  };
}

export function useSimulation() {
  const [state, setState] = useState<SimulationHookState>(() =>
    makeInitialState(DEFAULT_W1, DEFAULT_W2),
  );
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const stateRef = useRef(state);
  stateRef.current = state;

  const performStep = useCallback(
    (currentState: SimulationHookState): SimulationHookState => {
      const { w1, w2, learningRate, lossHistory, iteration } = currentState;
      const gw1 = gradW1(w1, w2);
      const gw2 = gradW2(w1, w2);
      const newW1 = w1 - learningRate * gw1;
      const newW2 = w2 - learningRate * gw2;
      // Clamp to prevent runaway
      const clampedW1 = Math.max(
        -W_RANGE * 1.5,
        Math.min(W_RANGE * 1.5, newW1),
      );
      const clampedW2 = Math.max(
        -W_RANGE * 1.5,
        Math.min(W_RANGE * 1.5, newW2),
      );
      const newLoss = lossFunction(clampedW1, clampedW2);
      const newGw1 = gradW1(clampedW1, clampedW2);
      const newGw2 = gradW2(clampedW1, clampedW2);
      const gradMag = Math.sqrt(newGw1 * newGw1 + newGw2 * newGw2);
      const newIteration = iteration + 1;
      const newHistory: LossEntry[] = [
        ...lossHistory.slice(-299),
        { iteration: newIteration, loss: newLoss },
      ];
      let status: ConvergenceStatus = "running";
      if (newLoss < 0.01) status = "converged";
      else if (
        newLoss > lossHistory[lossHistory.length - 1]?.loss * 2 &&
        iteration > 5
      )
        status = "diverging";

      return {
        ...currentState,
        w1: clampedW1,
        w2: clampedW2,
        iteration: newIteration,
        loss: newLoss,
        gradientMagnitude: gradMag,
        lossHistory: newHistory,
        convergenceStatus: status,
        gradW1Dir: newGw1,
        gradW2Dir: newGw2,
      };
    },
    [],
  );

  const step = useCallback(() => {
    setState((prev) => performStep({ ...prev, convergenceStatus: "running" }));
  }, [performStep]);

  const play = useCallback(() => {
    setState((prev) => ({
      ...prev,
      isRunning: true,
      convergenceStatus: "running",
    }));
  }, []);

  const pause = useCallback(() => {
    setState((prev) => ({ ...prev, isRunning: false }));
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
  }, []);

  const reset = useCallback(() => {
    pause();
    setState((prev) => makeInitialState(prev.initialW1, prev.initialW2));
  }, [pause]);

  const setLearningRate = useCallback((lr: number) => {
    setState((prev) => ({ ...prev, learningRate: lr }));
  }, []);

  const setInitialWeights = useCallback(
    (w1: number, w2: number) => {
      pause();
      setState(makeInitialState(w1, w2));
    },
    [pause],
  );

  // Manage interval for continuous run
  useEffect(() => {
    if (
      state.isRunning &&
      state.convergenceStatus !== "converged" &&
      state.convergenceStatus !== "diverging"
    ) {
      intervalRef.current = setInterval(() => {
        setState((prev) => {
          if (!prev.isRunning) return prev;
          const next = performStep(prev);
          if (
            next.convergenceStatus === "converged" ||
            next.convergenceStatus === "diverging"
          ) {
            return { ...next, isRunning: false };
          }
          return next;
        });
      }, 200);
    } else {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
    }
    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
    };
  }, [state.isRunning, state.convergenceStatus, performStep]);

  const result: StepResult = {
    w1: state.w1,
    w2: state.w2,
    loss: state.loss,
    gradientMagnitude: state.gradientMagnitude,
    iteration: state.iteration,
  };

  return {
    ...state,
    result,
    step,
    play,
    pause,
    reset,
    setLearningRate,
    setInitialWeights,
  };
}

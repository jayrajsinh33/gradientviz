export interface SimulationState {
  w1: number;
  w2: number;
  iteration: number;
  initialized: boolean;
  initialW1: number;
  initialW2: number;
}

export interface StepResult {
  w1: number;
  w2: number;
  loss: number;
  gradientMagnitude: number;
  iteration: number;
}

export interface LossEntry {
  iteration: number;
  loss: number;
}

export interface LossSurfacePoint {
  w1: number;
  w2: number;
  loss: number;
}

export interface SimulationControls {
  learningRate: number;
  initialW1: number;
  initialW2: number;
  isRunning: boolean;
  speed: number;
}

export type ConvergenceStatus = "idle" | "running" | "converged" | "diverging";

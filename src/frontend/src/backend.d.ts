import type { Principal } from "@icp-sdk/core/principal";
export interface Some<T> {
    __kind__: "Some";
    value: T;
}
export interface None {
    __kind__: "None";
}
export type Option<T> = Some<T> | None;
export interface LossSurfacePoint {
    w1: number;
    w2: number;
    loss: number;
}
export interface LossEntry {
    loss: number;
    iteration: bigint;
}
export interface StepResult {
    w1: number;
    w2: number;
    loss: number;
    gradientMagnitude: number;
    iteration: bigint;
}
export interface backendInterface {
    getLossHistory(): Promise<Array<LossEntry>>;
    getLossSurface(gridSize: bigint): Promise<Array<LossSurfacePoint>>;
    initialize(w1: number, w2: number): Promise<void>;
    reset(): Promise<void>;
    step(learningRate: number): Promise<StepResult>;
}

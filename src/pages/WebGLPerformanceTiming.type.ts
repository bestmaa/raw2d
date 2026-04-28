import type {
  WebGLPerformanceFrameTimer,
  WebGLPerformanceFrameTiming
} from "./WebGLPerformanceDemo.type";

export interface RollingFrameTimerOptions {
  readonly sampleSize?: number;
}

export type { WebGLPerformanceFrameTimer, WebGLPerformanceFrameTiming };

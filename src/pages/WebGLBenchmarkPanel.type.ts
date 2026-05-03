export interface WebGLBenchmarkRuntime {
  frameId: number | null;
  frame: number;
  lastTime: number;
  fps: number;
  connected: boolean;
}

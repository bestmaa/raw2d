export interface CanvasBenchmarkRuntime {
  frameId: number | null;
  frame: number;
  lastTime: number;
  fps: number;
  connected: boolean;
}

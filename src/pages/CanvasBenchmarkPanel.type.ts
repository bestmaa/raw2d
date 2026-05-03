export interface CanvasBenchmarkRuntime {
  frameId: number | null;
  frame: number;
  lastTime: number;
  fps: number;
  frameMs: number;
  connected: boolean;
  paused: boolean;
}

import type {
  RollingFrameTimerOptions,
  WebGLPerformanceFrameTimer,
  WebGLPerformanceFrameTiming
} from "./WebGLPerformanceTiming.type";

const defaultSampleSize = 60;
const emptyTiming: WebGLPerformanceFrameTiming = { frameMs: 0, fps: 0 };

export function createFrameTimer(options: RollingFrameTimerOptions = {}): WebGLPerformanceFrameTimer {
  return new RollingFrameTimer(options.sampleSize ?? defaultSampleSize);
}

class RollingFrameTimer implements WebGLPerformanceFrameTimer {
  private readonly samples: number[] = [];
  private readonly sampleSize: number;
  private snapshot: WebGLPerformanceFrameTiming = emptyTiming;

  public constructor(sampleSize: number) {
    this.sampleSize = sampleSize;
  }

  public record(frameMs: number): WebGLPerformanceFrameTiming {
    this.samples.push(Math.max(0, frameMs));

    if (this.samples.length > this.sampleSize) {
      this.samples.shift();
    }

    this.snapshot = this.createSnapshot();
    return this.snapshot;
  }

  public reset(): void {
    this.samples.length = 0;
    this.snapshot = emptyTiming;
  }

  public getSnapshot(): WebGLPerformanceFrameTiming {
    return this.snapshot;
  }

  private createSnapshot(): WebGLPerformanceFrameTiming {
    const total = this.samples.reduce((sum, value) => sum + value, 0);
    const frameMs = this.samples.length > 0 ? total / this.samples.length : 0;
    const fps = frameMs > 0 ? 1000 / frameMs : 0;
    return { frameMs, fps };
  }
}

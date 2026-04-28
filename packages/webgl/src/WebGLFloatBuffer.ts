import type { WebGLFloatBufferOptions, WebGLFloatBufferSnapshot } from "./WebGLFloatBuffer.type.js";

export class WebGLFloatBuffer {
  private buffer: Float32Array;
  private readonly growthFactor: number;
  private used = 0;

  public constructor(options: WebGLFloatBufferOptions = {}) {
    this.buffer = new Float32Array(Math.max(0, Math.floor(options.initialCapacity ?? 0)));
    this.growthFactor = Math.max(1.1, options.growthFactor ?? 2);
  }

  public acquire(floatCount: number): Float32Array {
    const count = Math.max(0, Math.floor(floatCount));
    this.ensureCapacity(count);
    this.used = count;
    return this.buffer.subarray(0, count);
  }

  public reset(): void {
    this.used = 0;
  }

  public getCapacity(): number {
    return this.buffer.length;
  }

  public getUsed(): number {
    return this.used;
  }

  public getSnapshot(): WebGLFloatBufferSnapshot {
    return {
      capacity: this.getCapacity(),
      used: this.getUsed()
    };
  }

  private ensureCapacity(floatCount: number): void {
    if (floatCount <= this.buffer.length) {
      return;
    }

    let nextCapacity = Math.max(1, this.buffer.length);

    while (nextCapacity < floatCount) {
      nextCapacity = Math.ceil(nextCapacity * this.growthFactor);
    }

    this.buffer = new Float32Array(nextCapacity);
  }
}

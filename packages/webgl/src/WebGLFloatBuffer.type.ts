export interface WebGLFloatBufferOptions {
  readonly initialCapacity?: number;
  readonly growthFactor?: number;
}

export interface WebGLFloatBufferSnapshot {
  readonly capacity: number;
  readonly used: number;
}

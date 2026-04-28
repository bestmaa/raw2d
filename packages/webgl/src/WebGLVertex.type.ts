import type { Camera2D } from "raw2d-core";

export interface WebGLVertexWriterOptions {
  readonly camera: Camera2D;
  readonly width: number;
  readonly height: number;
}


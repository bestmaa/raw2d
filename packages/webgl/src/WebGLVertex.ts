import type { Camera2D, Matrix3 } from "raw2d-core";
import type { WebGLColor } from "./WebGLColor.type.js";
import type { WebGLVertexWriterOptions } from "./WebGLVertex.type.js";

export const webGLFloatsPerVertex = 6;

export function toClipPoint(
  x: number,
  y: number,
  matrix: Matrix3,
  options: WebGLVertexWriterOptions
): { readonly x: number; readonly y: number } {
  const world = matrix.transformPoint({ x, y });
  const screenX = (world.x - options.camera.x) * options.camera.zoom;
  const screenY = (world.y - options.camera.y) * options.camera.zoom;

  return {
    x: (screenX / options.width) * 2 - 1,
    y: 1 - (screenY / options.height) * 2
  };
}

export function writeWebGLVertex(vertices: Float32Array, offset: number, x: number, y: number, color: WebGLColor): number {
  vertices[offset] = x;
  vertices[offset + 1] = y;
  vertices[offset + 2] = color.r;
  vertices[offset + 3] = color.g;
  vertices[offset + 4] = color.b;
  vertices[offset + 5] = color.a;
  return offset + webGLFloatsPerVertex;
}

export function getScreenOptions(camera: Camera2D, width: number, height: number): WebGLVertexWriterOptions {
  return { camera, width, height };
}


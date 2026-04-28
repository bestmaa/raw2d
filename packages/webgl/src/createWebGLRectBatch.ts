import { Rect } from "raw2d-core";
import { parseWebGLColor } from "./parseWebGLColor.js";
import type { WebGLColor } from "./WebGLColor.type.js";
import type { WebGLRectBatch, WebGLRectBatchOptions, WebGLRectItem } from "./WebGLRectBatch.type.js";

const floatsPerVertex = 6;
const verticesPerRect = 6;

export function createWebGLRectBatch(options: WebGLRectBatchOptions): WebGLRectBatch {
  const rectItems = options.items.filter(isRectItem);
  const vertices = new Float32Array(rectItems.length * verticesPerRect * floatsPerVertex);
  let offset = 0;

  for (const item of rectItems) {
    offset = writeRectVertices(vertices, offset, item, options);
  }

  return {
    vertices,
    rects: rectItems.length,
    unsupported: options.items.length - rectItems.length
  };
}

function isRectItem(item: WebGLRectBatchOptions["items"][number]): item is WebGLRectItem {
  return item.object instanceof Rect;
}

function writeRectVertices(
  vertices: Float32Array,
  offset: number,
  item: WebGLRectItem,
  options: WebGLRectBatchOptions
): number {
  const rect = item.object;
  const color = parseWebGLColor(rect.material.fillColor);
  const originX = rect.width * rect.originX;
  const originY = rect.height * rect.originY;
  const points = [
    toClipPoint(-originX, -originY, item, options),
    toClipPoint(rect.width - originX, -originY, item, options),
    toClipPoint(rect.width - originX, rect.height - originY, item, options),
    toClipPoint(-originX, -originY, item, options),
    toClipPoint(rect.width - originX, rect.height - originY, item, options),
    toClipPoint(-originX, rect.height - originY, item, options)
  ];

  for (const point of points) {
    offset = writeVertex(vertices, offset, point.x, point.y, color);
  }

  return offset;
}

function toClipPoint(
  x: number,
  y: number,
  item: WebGLRectItem,
  options: WebGLRectBatchOptions
): { readonly x: number; readonly y: number } {
  const world = item.worldMatrix.transformPoint({ x, y });
  const screenX = (world.x - options.camera.x) * options.camera.zoom;
  const screenY = (world.y - options.camera.y) * options.camera.zoom;

  return {
    x: (screenX / options.width) * 2 - 1,
    y: 1 - (screenY / options.height) * 2
  };
}

function writeVertex(vertices: Float32Array, offset: number, x: number, y: number, color: WebGLColor): number {
  vertices[offset] = x;
  vertices[offset + 1] = y;
  vertices[offset + 2] = color.r;
  vertices[offset + 3] = color.g;
  vertices[offset + 4] = color.b;
  vertices[offset + 5] = color.a;
  return offset + floatsPerVertex;
}


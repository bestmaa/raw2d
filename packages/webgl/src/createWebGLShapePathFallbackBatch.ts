import { ShapePath, type RenderItem } from "raw2d-core";
import { toClipPoint } from "./WebGLVertex.js";
import { getWebGLShapePathFillSupport } from "./writeWebGLShapePath.js";
import { resolveWebGLCurveSegments } from "./resolveWebGLCurveSegments.js";
import type { WebGLSpriteBatch, WebGLSpriteDrawBatch } from "./WebGLSpriteBatch.type.js";
import type { WebGLShapePathTextureEntry } from "./WebGLShapePathTextureCache.type.js";
import type { WebGLShapePathFallbackBatchOptions } from "./createWebGLShapePathFallbackBatch.type.js";

const floatsPerVertex = 5;
const verticesPerFallback = 6;

export function createWebGLShapePathFallbackBatch(options: WebGLShapePathFallbackBatchOptions): WebGLSpriteBatch {
  const items = options.items.filter((item): item is RenderItem<ShapePath> => shouldRasterizeShapePath(item, options));
  const vertices = options.floatBuffer?.acquire(items.length * verticesPerFallback * floatsPerVertex) ?? new Float32Array(items.length * verticesPerFallback * floatsPerVertex);
  const drawBatches: WebGLSpriteDrawBatch[] = [];
  let offset = 0;

  for (const item of items) {
    const firstVertex = offset / floatsPerVertex;
    const entry = options.getShapePathTexture(item.object);
    const textureKey = options.getTextureKey(entry.texture);
    offset = writeFallback(vertices, offset, item, entry, options);
    drawBatches.push({ key: textureKey, texture: entry.texture, firstVertex, vertexCount: verticesPerFallback });
  }

  return {
    vertices,
    drawBatches,
    sprites: 0,
    textures: new Set(drawBatches.map((batch) => batch.key)).size,
    unsupported: options.items.length - items.length
  };
}

export function shouldRasterizeShapePath(item: RenderItem, options: Pick<WebGLShapePathFallbackBatchOptions, "curveSegments">): item is RenderItem<ShapePath> {
  if (!(item.object instanceof ShapePath) || !item.object.fill) {
    return false;
  }

  const support = getWebGLShapePathFillSupport(item.object, resolveWebGLCurveSegments(options));
  return !support.supported && support.reason !== "disabled" && support.reason !== "empty";
}

function writeFallback(
  vertices: Float32Array,
  offset: number,
  item: RenderItem<ShapePath>,
  entry: WebGLShapePathTextureEntry,
  options: WebGLShapePathFallbackBatchOptions
): number {
  const points = [
    [entry.localX, entry.localY, 0, 0],
    [entry.localX + entry.width, entry.localY, 1, 0],
    [entry.localX + entry.width, entry.localY + entry.height, 1, 1],
    [entry.localX, entry.localY, 0, 0],
    [entry.localX + entry.width, entry.localY + entry.height, 1, 1],
    [entry.localX, entry.localY + entry.height, 0, 1]
  ] as const;

  for (const point of points) {
    const clip = toClipPoint(point[0], point[1], item.worldMatrix, options);
    offset = writeVertex(vertices, offset, clip.x, clip.y, point[2], point[3]);
  }

  return offset;
}

function writeVertex(vertices: Float32Array, offset: number, x: number, y: number, u: number, v: number): number {
  vertices[offset] = x;
  vertices[offset + 1] = y;
  vertices[offset + 2] = u;
  vertices[offset + 3] = v;
  vertices[offset + 4] = 1;
  return offset + floatsPerVertex;
}

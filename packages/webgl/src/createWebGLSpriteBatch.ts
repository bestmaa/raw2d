import type { RenderItem } from "raw2d-core";
import { Sprite } from "raw2d-sprite";
import type { Texture } from "raw2d-sprite";
import { Text2D } from "raw2d-text";
import { getWebGLSpriteUV } from "./getWebGLSpriteUV.js";
import { toClipPoint } from "./WebGLVertex.js";
import type {
  WebGLSpriteBatch,
  WebGLSpriteBatchOptions,
  WebGLSpriteDrawBatch,
  WebGLSpriteItem,
  WebGLTextureItem
} from "./WebGLSpriteBatch.type.js";
import type { WebGLTextTextureEntry } from "./WebGLTextTextureCache.type.js";

const floatsPerSpriteVertex = 5;
const verticesPerSprite = 6;

export function createWebGLSpriteBatch(options: WebGLSpriteBatchOptions): WebGLSpriteBatch {
  const textureItems = options.items.filter((item): item is WebGLTextureItem => isTextureItem(item, options));
  const floatCount = textureItems.length * verticesPerSprite * floatsPerSpriteVertex;
  const vertices = options.floatBuffer?.acquire(floatCount) ?? new Float32Array(floatCount);
  const drawBatches: WebGLSpriteDrawBatch[] = [];
  const textureKeys = new Set<string>();
  let offset = 0;

  for (const item of textureItems) {
    const firstVertex = offset / floatsPerSpriteVertex;
    const textTexture = isTextItem(item) ? getTextTexture(item.object, options) : undefined;
    const texture = getItemTexture(item, textTexture);
    const textureKey = options.getTextureKey(texture);
    textureKeys.add(textureKey);
    if (isSpriteItem(item)) {
      offset = writeSprite(vertices, offset, item, options);
    } else if (isTextItem(item)) {
      offset = writeText(vertices, offset, item, getResolvedTextTexture(textTexture), options);
    }
    appendSpriteDrawBatch(drawBatches, {
      key: textureKey,
      texture,
      firstVertex,
      vertexCount: verticesPerSprite
    });
  }

  return {
    vertices,
    drawBatches,
    sprites: textureItems.filter((item) => item.object instanceof Sprite).length,
    textures: textureKeys.size,
    unsupported: options.items.length - textureItems.length
  };
}

function isTextureItem(item: WebGLSpriteBatchOptions["items"][number], options: WebGLSpriteBatchOptions): boolean {
  return item.object instanceof Sprite || (item.object instanceof Text2D && options.getTextTexture !== undefined);
}

function isSpriteItem(item: WebGLTextureItem): item is WebGLSpriteItem {
  return item.object instanceof Sprite;
}

function isTextItem(item: WebGLTextureItem): item is RenderItem<Text2D> {
  return item.object instanceof Text2D;
}

function getItemTexture(item: WebGLTextureItem, textTexture?: WebGLTextTextureEntry): Texture {
  if (item.object instanceof Sprite) {
    return item.object.texture;
  }

  return getResolvedTextTexture(textTexture).texture;
}

function getTextTexture(text: Text2D, options: WebGLSpriteBatchOptions): WebGLTextTextureEntry {
  const textTexture = options.getTextTexture?.(text);

  if (!textTexture) {
    throw new Error("Text2D texture provider is required for WebGL text batching.");
  }

  return textTexture;
}

function getResolvedTextTexture(textTexture: WebGLTextTextureEntry | undefined): WebGLTextTextureEntry {
  if (!textTexture) {
    throw new Error("Text2D texture provider is required for WebGL text batching.");
  }

  return textTexture;
}

function writeSprite(vertices: Float32Array, offset: number, item: WebGLSpriteItem, options: WebGLSpriteBatchOptions): number {
  const sprite = item.object;
  const originX = sprite.width * sprite.originX;
  const originY = sprite.height * sprite.originY;
  const uv = getWebGLSpriteUV(sprite);
  const points = [
    [-originX, -originY, uv.u0, uv.v0],
    [sprite.width - originX, -originY, uv.u1, uv.v0],
    [sprite.width - originX, sprite.height - originY, uv.u1, uv.v1],
    [-originX, -originY, uv.u0, uv.v0],
    [sprite.width - originX, sprite.height - originY, uv.u1, uv.v1],
    [-originX, sprite.height - originY, uv.u0, uv.v1]
  ] as const;

  for (const point of points) {
    const clip = toClipPoint(point[0], point[1], item.worldMatrix, options);
    offset = writeSpriteVertex(vertices, offset, clip.x, clip.y, point[2], point[3], sprite.opacity);
  }

  return offset;
}

function writeText(
  vertices: Float32Array,
  offset: number,
  item: RenderItem<Text2D>,
  entry: WebGLTextTextureEntry,
  options: WebGLSpriteBatchOptions
): number {
  const text = item.object;
  const originX = entry.localX + entry.width * text.originX;
  const originY = entry.localY + entry.height * text.originY;
  const points = [
    [entry.localX - originX, entry.localY - originY, 0, 0],
    [entry.localX + entry.width - originX, entry.localY - originY, 1, 0],
    [entry.localX + entry.width - originX, entry.localY + entry.height - originY, 1, 1],
    [entry.localX - originX, entry.localY - originY, 0, 0],
    [entry.localX + entry.width - originX, entry.localY + entry.height - originY, 1, 1],
    [entry.localX - originX, entry.localY + entry.height - originY, 0, 1]
  ] as const;

  for (const point of points) {
    const clip = toClipPoint(point[0], point[1], item.worldMatrix, options);
    offset = writeSpriteVertex(vertices, offset, clip.x, clip.y, point[2], point[3], 1);
  }

  return offset;
}

function writeSpriteVertex(vertices: Float32Array, offset: number, x: number, y: number, u: number, v: number, alpha: number): number {
  vertices[offset] = x;
  vertices[offset + 1] = y;
  vertices[offset + 2] = u;
  vertices[offset + 3] = v;
  vertices[offset + 4] = alpha;
  return offset + floatsPerSpriteVertex;
}

function appendSpriteDrawBatch(batches: WebGLSpriteDrawBatch[], batch: WebGLSpriteDrawBatch): void {
  const lastBatch = batches.at(-1);

  if (lastBatch && lastBatch.key === batch.key && lastBatch.firstVertex + lastBatch.vertexCount === batch.firstVertex) {
    batches[batches.length - 1] = { ...lastBatch, vertexCount: lastBatch.vertexCount + batch.vertexCount };
    return;
  }

  batches.push(batch);
}

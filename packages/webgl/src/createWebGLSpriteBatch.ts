import { Sprite } from "raw2d-sprite";
import { getWebGLSpriteUV } from "./getWebGLSpriteUV.js";
import { toClipPoint } from "./WebGLVertex.js";
import type { WebGLSpriteBatch, WebGLSpriteBatchOptions, WebGLSpriteDrawBatch, WebGLSpriteItem } from "./WebGLSpriteBatch.type.js";

const floatsPerSpriteVertex = 5;
const verticesPerSprite = 6;

export function createWebGLSpriteBatch(options: WebGLSpriteBatchOptions): WebGLSpriteBatch {
  const spriteItems = options.items.filter(isSpriteItem);
  const vertices = new Float32Array(spriteItems.length * verticesPerSprite * floatsPerSpriteVertex);
  const drawBatches: WebGLSpriteDrawBatch[] = [];
  const textureKeys = new Set<string>();
  let offset = 0;

  for (const item of spriteItems) {
    const firstVertex = offset / floatsPerSpriteVertex;
    const textureKey = options.getTextureKey(item.object.texture);
    textureKeys.add(textureKey);
    offset = writeSprite(vertices, offset, item, options);
    appendSpriteDrawBatch(drawBatches, {
      key: textureKey,
      texture: item.object.texture,
      firstVertex,
      vertexCount: verticesPerSprite
    });
  }

  return {
    vertices,
    drawBatches,
    sprites: spriteItems.length,
    textures: textureKeys.size,
    unsupported: options.items.length - spriteItems.length
  };
}

function isSpriteItem(item: WebGLSpriteBatchOptions["items"][number]): item is WebGLSpriteItem {
  return item.object instanceof Sprite;
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

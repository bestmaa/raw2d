import type { MutableWebGLRenderStats } from "./MutableWebGLRenderStats.type.js";
import type { WebGLShapeBatch } from "./WebGLShapeBatch.type.js";
import type { WebGLSpriteBatch } from "./WebGLSpriteBatch.type.js";
import type { WebGLTextureCache } from "./WebGLTextureCache.js";

export function drawWebGLShapeBatch(gl: WebGL2RenderingContext, batch: WebGLShapeBatch): void {
  for (const drawBatch of batch.drawBatches) {
    gl.drawArrays(gl.TRIANGLES, drawBatch.firstVertex, drawBatch.vertexCount);
  }
}

export function drawWebGLSpriteBatch(
  gl: WebGL2RenderingContext,
  batch: WebGLSpriteBatch,
  textureCache: WebGLTextureCache,
  stats: MutableWebGLRenderStats
): void {
  for (const drawBatch of batch.drawBatches) {
    const textureResult = textureCache.getWithResult(drawBatch.texture);

    gl.activeTexture(gl.TEXTURE0);
    gl.bindTexture(gl.TEXTURE_2D, textureResult.texture);
    gl.drawArrays(gl.TRIANGLES, drawBatch.firstVertex, drawBatch.vertexCount);
    stats.textures.add(drawBatch.key);
    stats.textureBinds += 1;

    if (textureResult.uploaded) {
      stats.textureUploads += 1;
    } else {
      stats.textureCacheHits += 1;
    }
  }
}

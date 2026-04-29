import { Sprite } from "raw2d-sprite";
import { isWebGLTextureDisposed } from "./isWebGLTextureDisposed.js";
import type { WebGLRenderRun } from "./WebGLRenderRun.type.js";
import type { WebGLTextureCache } from "./WebGLTextureCache.js";

export function releaseDisposedWebGLSpriteTextures(run: WebGLRenderRun, textureCache: WebGLTextureCache): void {
  for (const item of run.items) {
    if (item.object instanceof Sprite && isWebGLTextureDisposed(item.object.texture)) {
      textureCache.delete(item.object.texture);
    }
  }
}

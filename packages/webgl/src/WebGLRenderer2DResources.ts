import { createWebGLBufferUploaders } from "./createWebGLBufferUploaders.js";
import { createWebGLProgram } from "./createWebGLProgram.js";
import { WebGLStaticBatchCache } from "./WebGLStaticBatchCache.js";
import { WebGLTextTextureCache } from "./WebGLTextTextureCache.js";
import { WebGLTextureCache } from "./WebGLTextureCache.js";
import { shapeFragmentSource, shapeVertexSource, spriteFragmentSource, spriteVertexSource } from "./WebGLRenderer2DShaders.js";
import type { WebGLBufferUploaderMap } from "./WebGLBufferUploaderMap.type.js";
import type { WebGLRenderer2DResourceOptions } from "./WebGLRenderer2DResources.type.js";
import type { WebGLShapeBatch } from "./WebGLShapeBatch.type.js";
import type { WebGLSpriteBatch } from "./WebGLSpriteBatch.type.js";

export class WebGLRenderer2DResources {
  public readonly shapeProgram: WebGLProgram;
  public readonly spriteProgram: WebGLProgram;
  public readonly shapeUploaders: WebGLBufferUploaderMap;
  public readonly spriteUploaders: WebGLBufferUploaderMap;
  public readonly textureCache: WebGLTextureCache;
  public readonly textTextureCache: WebGLTextTextureCache;
  public readonly staticShapeCache: WebGLStaticBatchCache<WebGLShapeBatch>;
  public readonly staticSpriteCache: WebGLStaticBatchCache<WebGLSpriteBatch>;
  private readonly gl: WebGL2RenderingContext;

  public constructor(gl: WebGL2RenderingContext, options: WebGLRenderer2DResourceOptions = {}) {
    this.gl = gl;
    this.shapeProgram = createWebGLProgram(gl, shapeVertexSource, shapeFragmentSource);
    this.spriteProgram = createWebGLProgram(gl, spriteVertexSource, spriteFragmentSource);
    this.shapeUploaders = createWebGLBufferUploaders(gl);
    this.spriteUploaders = createWebGLBufferUploaders(gl);
    this.staticShapeCache = new WebGLStaticBatchCache(gl);
    this.staticSpriteCache = new WebGLStaticBatchCache(gl);
    this.textureCache = new WebGLTextureCache(gl);
    this.textTextureCache = new WebGLTextTextureCache({
      createCanvas: options.createTextCanvas,
      maxEntries: options.textTextureCacheMaxEntries
    });
    this.gl.enable(this.gl.BLEND);
    this.gl.blendFunc(this.gl.SRC_ALPHA, this.gl.ONE_MINUS_SRC_ALPHA);
  }

  public clearTextureCache(): void {
    this.textTextureCache.clear();
    this.releaseRetiredTextTextures();
    this.textureCache.clear();
  }

  public releaseRetiredTextTextures(): void {
    for (const texture of this.textTextureCache.drainRetiredTextures()) {
      this.textureCache.delete(texture);
    }
  }

  public dispose(): void {
    this.staticShapeCache.dispose();
    this.staticSpriteCache.dispose();
    for (const uploader of [this.shapeUploaders.dynamic, this.shapeUploaders.static, this.spriteUploaders.dynamic, this.spriteUploaders.static]) {
      uploader.dispose();
    }
    this.textureCache.dispose();
    this.textTextureCache.dispose();
    this.gl.deleteProgram(this.shapeProgram);
    this.gl.deleteProgram(this.spriteProgram);
  }
}

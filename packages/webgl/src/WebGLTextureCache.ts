import type { Texture } from "raw2d-sprite";
import { isWebGLTextureDisposed } from "./isWebGLTextureDisposed.js";
import type { WebGLTextureCacheResult } from "./WebGLTextureCacheResult.type.js";

export class WebGLTextureCache {
  private readonly textures = new Map<Texture, WebGLTexture>();
  private readonly textureIds = new Map<Texture, number>();
  private readonly gl: WebGL2RenderingContext;
  private nextTextureId = 1;

  public constructor(gl: WebGL2RenderingContext) {
    this.gl = gl;
  }

  public get(texture: Texture): WebGLTexture {
    return this.getWithResult(texture).texture;
  }

  public getWithResult(texture: Texture): WebGLTextureCacheResult {
    if (isWebGLTextureDisposed(texture)) {
      this.delete(texture);
      throw new Error(`Cannot upload disposed texture: ${texture.id}`);
    }

    const cachedTexture = this.textures.get(texture);

    if (cachedTexture) {
      return { texture: cachedTexture, uploaded: false };
    }

    const webglTexture = this.createTexture(texture);
    this.textures.set(texture, webglTexture);
    return { texture: webglTexture, uploaded: true };
  }

  public getKey(texture: Texture): string {
    const existingId = this.textureIds.get(texture);

    if (existingId !== undefined) {
      return `texture:${existingId}`;
    }

    const nextId = this.nextTextureId;
    this.nextTextureId += 1;
    this.textureIds.set(texture, nextId);
    return `texture:${nextId}`;
  }

  public delete(texture: Texture): boolean {
    const webglTexture = this.textures.get(texture);
    this.textureIds.delete(texture);

    if (!webglTexture) {
      return false;
    }

    this.gl.deleteTexture(webglTexture);
    this.textures.delete(texture);
    return true;
  }

  public clear(): void {
    for (const webglTexture of this.textures.values()) {
      this.gl.deleteTexture(webglTexture);
    }

    this.textures.clear();
    this.textureIds.clear();
    this.nextTextureId = 1;
  }

  public getSize(): number {
    return this.textures.size;
  }

  public dispose(): void {
    this.clear();
  }

  private createTexture(texture: Texture): WebGLTexture {
    const webglTexture = this.gl.createTexture();

    if (!webglTexture) {
      throw new Error("Unable to create WebGL texture.");
    }

    this.gl.bindTexture(this.gl.TEXTURE_2D, webglTexture);
    this.gl.texParameteri(this.gl.TEXTURE_2D, this.gl.TEXTURE_MIN_FILTER, this.gl.LINEAR);
    this.gl.texParameteri(this.gl.TEXTURE_2D, this.gl.TEXTURE_MAG_FILTER, this.gl.LINEAR);
    this.gl.texParameteri(this.gl.TEXTURE_2D, this.gl.TEXTURE_WRAP_S, this.gl.CLAMP_TO_EDGE);
    this.gl.texParameteri(this.gl.TEXTURE_2D, this.gl.TEXTURE_WRAP_T, this.gl.CLAMP_TO_EDGE);
    this.gl.texImage2D(this.gl.TEXTURE_2D, 0, this.gl.RGBA, this.gl.RGBA, this.gl.UNSIGNED_BYTE, getUploadSource(texture));
    return webglTexture;
  }
}

function getUploadSource(texture: Texture): TexImageSource {
  if (isSvgImageElement(texture.source)) {
    throw new Error("WebGL texture upload needs a raster source. Draw SVG to a canvas first.");
  }

  return texture.source;
}

function isSvgImageElement(source: CanvasImageSource): source is SVGImageElement {
  return typeof SVGImageElement !== "undefined" && source instanceof SVGImageElement;
}

import type { Texture } from "raw2d-sprite";

export class WebGLTextureCache {
  private readonly textures = new Map<Texture, WebGLTexture>();
  private readonly textureIds = new Map<Texture, number>();
  private readonly gl: WebGL2RenderingContext;
  private nextTextureId = 1;

  public constructor(gl: WebGL2RenderingContext) {
    this.gl = gl;
  }

  public get(texture: Texture): WebGLTexture {
    const cachedTexture = this.textures.get(texture);

    if (cachedTexture) {
      return cachedTexture;
    }

    const webglTexture = this.createTexture(texture);
    this.textures.set(texture, webglTexture);
    return webglTexture;
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

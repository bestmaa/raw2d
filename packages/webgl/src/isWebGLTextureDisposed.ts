import type { Texture } from "raw2d-sprite";

interface DisposableTexture {
  isDisposed(): boolean;
}

export function isWebGLTextureDisposed(texture: Texture): boolean {
  return "isDisposed" in texture && typeof texture.isDisposed === "function" && (texture as Texture & DisposableTexture).isDisposed();
}


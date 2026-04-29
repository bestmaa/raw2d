import type { TextureSize, TextureSource } from "./Texture.type.js";

interface NaturalSizeSource {
  readonly naturalWidth: number;
  readonly naturalHeight: number;
}

interface DisplaySizeSource {
  readonly displayWidth: number;
  readonly displayHeight: number;
}

interface VideoSizeSource {
  readonly videoWidth: number;
  readonly videoHeight: number;
}

interface WidthHeightSource {
  readonly width: number;
  readonly height: number;
}

export function getTextureSourceSize(source: TextureSource): TextureSize {
  if (isNaturalSizeSource(source)) {
    return { width: source.naturalWidth, height: source.naturalHeight };
  }

  if (isSvgImageSource(source)) {
    return { width: source.width.baseVal.value, height: source.height.baseVal.value };
  }

  if (isVideoSizeSource(source)) {
    return { width: source.videoWidth, height: source.videoHeight };
  }

  if (isDisplaySizeSource(source)) {
    return { width: source.displayWidth, height: source.displayHeight };
  }

  if (isWidthHeightSource(source)) {
    return { width: source.width, height: source.height };
  }

  return { width: 0, height: 0 };
}

function isNaturalSizeSource(source: TextureSource): source is TextureSource & NaturalSizeSource {
  return "naturalWidth" in source && "naturalHeight" in source;
}

function isSvgImageSource(source: TextureSource): source is SVGImageElement {
  return typeof SVGImageElement !== "undefined" && source instanceof SVGImageElement;
}

function isVideoSizeSource(source: TextureSource): source is TextureSource & VideoSizeSource {
  return "videoWidth" in source && "videoHeight" in source;
}

function isDisplaySizeSource(source: TextureSource): source is TextureSource & DisplaySizeSource {
  return "displayWidth" in source && "displayHeight" in source;
}

function isWidthHeightSource(source: TextureSource): source is TextureSource & WidthHeightSource {
  return "width" in source && "height" in source && typeof source.width === "number" && typeof source.height === "number";
}

export function normalizeTextureSize(size: TextureSize): TextureSize {
  return {
    width: Math.max(0, size.width),
    height: Math.max(0, size.height)
  };
}

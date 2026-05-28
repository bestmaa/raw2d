import { Texture } from "./Texture.js";
import type {
  CreateSvgTextureOptions,
  SvgRasterizeCanvas,
  SvgRasterizeImage,
  SvgRasterizeInput,
  SvgRasterizeOptions
} from "./SvgTexture.type.js";
import type { TextureSource } from "./Texture.type.js";

export async function rasterizeSvgToCanvas(options: SvgRasterizeOptions): Promise<SvgRasterizeCanvas> {
  const width = Math.max(1, Math.floor(options.width));
  const height = Math.max(1, Math.floor(options.height));
  const canvas = createRasterCanvas(width, height, options.createCanvas);
  const context = canvas.getContext("2d");

  if (!context) {
    throw new Error("SVG rasterization needs a 2D canvas context.");
  }

  const image = createRasterImage(options.createImage);
  const svgBlob = createSvgBlob(options.svg);
  const objectUrl = createObjectUrl(svgBlob, options.createObjectURL);

  try {
    await loadSvgImage(image, objectUrl);
    if (image.decode) {
      await image.decode();
    }

    canvas.width = width;
    canvas.height = height;
    context.clearRect(0, 0, width, height);
    context.drawImage(image as unknown as TextureSource, 0, 0, width, height);
    return canvas;
  } finally {
    revokeObjectUrl(objectUrl, options.revokeObjectURL);
  }
}

export async function createSvgTexture(options: CreateSvgTextureOptions): Promise<Texture> {
  const canvas = await rasterizeSvgToCanvas(options);

  return new Texture({
    source: canvas,
    width: canvas.width,
    height: canvas.height,
    id: options.id,
    url: options.url
  });
}

function createRasterCanvas(
  width: number,
  height: number,
  createCanvas?: SvgRasterizeOptions["createCanvas"]
): SvgRasterizeCanvas {
  if (createCanvas) {
    const canvas = createCanvas(width, height);
    canvas.width = width;
    canvas.height = height;
    return canvas;
  }

  if (typeof document !== "undefined") {
    const canvas = document.createElement("canvas");
    canvas.width = width;
    canvas.height = height;
    return canvas;
  }

  if (typeof OffscreenCanvas !== "undefined") {
    return new OffscreenCanvas(width, height) as unknown as SvgRasterizeCanvas;
  }

  throw new Error("SVG rasterization needs createCanvas outside browser environments.");
}

function createRasterImage(createImage?: SvgRasterizeOptions["createImage"]): SvgRasterizeImage {
  if (createImage) {
    return createImage();
  }

  if (typeof Image === "undefined") {
    throw new Error("SVG rasterization needs a browser Image implementation or custom createImage option.");
  }

  return new Image();
}

function createSvgBlob(svg: SvgRasterizeInput): Blob {
  if (typeof svg !== "string") {
    return svg;
  }

  if (typeof Blob === "undefined") {
    throw new Error("SVG rasterization needs Blob support or a Blob input.");
  }

  return new Blob([svg], { type: "image/svg+xml;charset=utf-8" });
}

function createObjectUrl(blob: Blob, createObjectURL?: SvgRasterizeOptions["createObjectURL"]): string {
  if (createObjectURL) {
    return createObjectURL(blob);
  }

  if (typeof URL === "undefined" || typeof URL.createObjectURL !== "function") {
    throw new Error("SVG rasterization needs URL.createObjectURL or a custom createObjectURL option.");
  }

  return URL.createObjectURL(blob);
}

function revokeObjectUrl(url: string, revokeObjectURL?: SvgRasterizeOptions["revokeObjectURL"]): void {
  if (revokeObjectURL) {
    revokeObjectURL(url);
    return;
  }

  URL.revokeObjectURL(url);
}

function loadSvgImage(image: SvgRasterizeImage, url: string): Promise<void> {
  return new Promise((resolve, reject) => {
    const cleanup = (): void => {
      image.removeEventListener("load", handleLoad);
      image.removeEventListener("error", handleError);
    };
    const handleLoad = (): void => {
      cleanup();
      resolve();
    };
    const handleError = (): void => {
      cleanup();
      reject(new Error("Failed to rasterize SVG texture."));
    };

    image.crossOrigin = "anonymous";
    image.addEventListener("load", handleLoad);
    image.addEventListener("error", handleError);
    image.src = url;
  });
}

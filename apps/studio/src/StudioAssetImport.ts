import type { StudioImageAssetImportOptions, StudioImageAssetImportResult } from "./StudioAssetImport.type";

export async function createStudioImageAssetInputFromFile(
  options: StudioImageAssetImportOptions
): Promise<StudioImageAssetImportResult> {
  const src = (options.createObjectUrl ?? URL.createObjectURL)(options.file);
  const image = options.imageFactory?.() ?? new Image();
  const dimensions = await loadImageDimensions(image, src);

  return {
    name: options.file.name,
    width: dimensions.width,
    height: dimensions.height,
    src,
    mimeType: options.file.type || undefined
  };
}

function loadImageDimensions(image: HTMLImageElement, src: string): Promise<{ readonly width: number; readonly height: number }> {
  return new Promise((resolve, reject) => {
    image.onload = () => {
      resolve({
        width: image.naturalWidth || image.width,
        height: image.naturalHeight || image.height
      });
    };
    image.onerror = () => {
      reject(new Error("Studio image asset could not be loaded."));
    };
    image.src = src;
  });
}

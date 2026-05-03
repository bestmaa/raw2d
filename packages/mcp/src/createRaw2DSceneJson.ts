import type { CreateRaw2DSceneJsonOptions, Raw2DMcpSceneDocument } from "./Raw2DSceneJson.type.js";

export function createRaw2DSceneJson(options: CreateRaw2DSceneJsonOptions = {}): Raw2DMcpSceneDocument {
  return {
    scene: {
      objects: []
    },
    camera: {
      x: normalizeNumber(options.camera?.x, 0),
      y: normalizeNumber(options.camera?.y, 0),
      zoom: normalizeZoom(options.camera?.zoom)
    }
  };
}

function normalizeNumber(value: number | undefined, fallback: number): number {
  return typeof value === "number" && Number.isFinite(value) ? value : fallback;
}

function normalizeZoom(value: number | undefined): number {
  if (typeof value !== "number" || !Number.isFinite(value)) {
    return 1;
  }

  return value > 0 ? value : 1;
}

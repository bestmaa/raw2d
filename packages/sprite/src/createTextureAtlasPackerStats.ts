import type {
  TextureAtlasPackerStats,
  TextureAtlasPackerStatsFrame
} from "./TextureAtlasPacker.type.js";

export function createTextureAtlasPackerStats(
  width: number,
  height: number,
  frames: readonly TextureAtlasPackerStatsFrame[]
): TextureAtlasPackerStats {
  const totalArea = width * height;
  const usedArea = frames.reduce((sum, frame) => sum + frame.width * frame.height, 0);

  return {
    width,
    height,
    totalArea,
    usedArea,
    wastedArea: Math.max(0, totalArea - usedArea),
    occupancy: totalArea > 0 ? usedArea / totalArea : 0,
    frameCount: frames.length
  };
}

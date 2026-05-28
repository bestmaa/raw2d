import type {
  TextureAtlasPackerResizeSuggestion,
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
  const bounds = getOccupiedBounds(frames);
  const occupiedBoundsArea = bounds.width * bounds.height;
  const fragmentedArea = Math.max(0, occupiedBoundsArea - usedArea);
  const outerWasteArea = Math.max(0, totalArea - occupiedBoundsArea);
  const wastedArea = Math.max(0, totalArea - usedArea);

  return {
    width,
    height,
    totalArea,
    usedArea,
    wastedArea,
    fragmentedArea,
    outerWasteArea,
    occupancy: totalArea > 0 ? usedArea / totalArea : 0,
    fragmentation: wastedArea > 0 ? fragmentedArea / wastedArea : 0,
    frameCount: frames.length,
    resizeSuggestion: createResizeSuggestion({
      width,
      height,
      usedArea,
      fragmentedArea,
      outerWasteArea,
      bounds,
      frames
    })
  };
}

interface OccupiedBounds {
  readonly width: number;
  readonly height: number;
}

interface ResizeSuggestionOptions {
  readonly width: number;
  readonly height: number;
  readonly usedArea: number;
  readonly fragmentedArea: number;
  readonly outerWasteArea: number;
  readonly bounds: OccupiedBounds;
  readonly frames: readonly TextureAtlasPackerStatsFrame[];
}

function getOccupiedBounds(frames: readonly TextureAtlasPackerStatsFrame[]): OccupiedBounds {
  const width = frames.reduce((current, frame) => Math.max(current, (frame.x ?? 0) + frame.width), 1);
  const height = frames.reduce((current, frame) => Math.max(current, (frame.y ?? 0) + frame.height), 1);

  return { width, height };
}

function createResizeSuggestion(options: ResizeSuggestionOptions): TextureAtlasPackerResizeSuggestion {
  if (options.frames.length === 0) {
    return { action: "keep", width: options.width, height: options.height, reason: "Atlas has no frames." };
  }

  if (shouldShrink(options)) {
    return {
      action: "shrink",
      width: options.bounds.width,
      height: options.bounds.height,
      reason: "Outer empty area is larger than internal packing gaps."
    };
  }

  if (shouldGrowWidth(options)) {
    return {
      action: "growWidth",
      width: nextPowerOfTwo(options.width + getLargestFrameWidth(options.frames)),
      height: options.height,
      reason: "Internal row gaps dominate wasted area; a wider atlas may reduce fragmentation."
    };
  }

  return { action: "keep", width: options.width, height: options.height, reason: "Current atlas size is balanced for this layout." };
}

function shouldShrink(options: ResizeSuggestionOptions): boolean {
  return options.outerWasteArea > options.fragmentedArea && options.outerWasteArea >= options.usedArea * 0.25;
}

function shouldGrowWidth(options: ResizeSuggestionOptions): boolean {
  const wastedArea = options.fragmentedArea + options.outerWasteArea;
  return wastedArea > 0 && options.fragmentedArea / wastedArea >= 0.5;
}

function getLargestFrameWidth(frames: readonly TextureAtlasPackerStatsFrame[]): number {
  return frames.reduce((current, frame) => Math.max(current, frame.width), 1);
}

function nextPowerOfTwo(value: number): number {
  let result = 1;

  while (result < value) {
    result *= 2;
  }

  return result;
}

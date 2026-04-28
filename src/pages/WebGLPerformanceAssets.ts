import { Texture, TextureAtlasPacker } from "raw2d";
import type { WebGLPerformanceAssets } from "./WebGLPerformanceDemo.type";

const spriteSize = 16;

export function createWebGLPerformanceAssets(): WebGLPerformanceAssets {
  const idle = createTileSource("#35c2ff", "#f8fafc");
  const run = createTileSource("#f45b69", "#10141c");
  const atlas = new TextureAtlasPacker({ padding: 2, powerOfTwo: true }).pack([
    { name: "idle", source: idle },
    { name: "run", source: run }
  ]);

  return {
    atlas,
    separate: [
      new Texture({ source: idle, width: spriteSize, height: spriteSize }),
      new Texture({ source: run, width: spriteSize, height: spriteSize })
    ]
  };
}

function createTileSource(fill: string, accent: string): HTMLCanvasElement {
  const canvas = document.createElement("canvas");
  const context = canvas.getContext("2d");
  canvas.width = spriteSize;
  canvas.height = spriteSize;

  if (!context) {
    return canvas;
  }

  context.fillStyle = fill;
  context.fillRect(0, 0, spriteSize, spriteSize);
  context.fillStyle = accent;
  context.fillRect(3, 3, 10, 10);
  context.fillStyle = "rgba(255,255,255,0.35)";
  context.fillRect(2, 2, 12, 2);
  return canvas;
}

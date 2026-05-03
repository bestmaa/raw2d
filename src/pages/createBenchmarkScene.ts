import { BasicMaterial, Circle, Line, Rect, Scene, Sprite, Texture, TextureAtlas } from "raw2d";
import type { BenchmarkSceneOptions } from "./BenchmarkScene.type";

const columns = 20;
const cellWidth = 17;
const cellHeight = 24;
const spriteSize = 12;

export function createBenchmarkScene(options: BenchmarkSceneOptions): Scene {
  const scene = new Scene();
  const materialA = new BasicMaterial({ fillColor: "#35c2ff" });
  const materialB = new BasicMaterial({ fillColor: "#f45b69" });
  const spriteSource = options.objectKind === "mixed" ? createSpriteSource(options.atlasEnabled) : null;

  for (let index = 0; index < options.objectCount; index += 1) {
    const material = index % 2 === 0 ? materialA : materialB;
    const x = 12 + (index % columns) * cellWidth;
    const y = 16 + Math.floor(index / columns) * cellHeight;
    const renderMode = index < options.objectCount * options.staticRatio ? "static" : "dynamic";
    const mixedKind = getMixedKind(index, options.objectCount);

    if (spriteSource && mixedKind === "sprite") {
      scene.add(createSprite({ spriteSource, index, x, y, renderMode }));
    } else if (options.objectKind === "mixed" && mixedKind === "line") {
      scene.add(new Line({ x, y: y + 8, endX: 12, endY: 0, renderMode, material }));
    } else if (options.objectKind === "circle" || (options.objectKind === "mixed" && mixedKind === "circle")) {
      scene.add(new Circle({ x: x + 5, y: y + 7, radius: 6, renderMode, material }));
    } else {
      scene.add(new Rect({ x, y, width: 11, height: 16, renderMode, material }));
    }
  }

  return scene;
}

type MixedKind = "rect" | "circle" | "line" | "sprite";

function getMixedKind(index: number, objectCount: number): MixedKind {
  const segmentSize = Math.max(1, Math.ceil(objectCount / 4));
  const segment = Math.floor(index / segmentSize);

  if (segment === 1) {
    return "circle";
  }

  if (segment === 2) {
    return "line";
  }

  if (segment >= 3) {
    return "sprite";
  }

  return "rect";
}

interface SpriteSource {
  readonly textures: readonly Texture[];
  readonly atlas: TextureAtlas | null;
}

function createSprite(options: {
  readonly spriteSource: SpriteSource;
  readonly index: number;
  readonly x: number;
  readonly y: number;
  readonly renderMode: "static" | "dynamic";
}): Sprite {
  const frameName = Math.floor(options.index / 4) % 2 === 0 ? "cyan" : "red";
  const frame = options.spriteSource.atlas?.getFrame(frameName) ?? null;
  const texture = options.spriteSource.atlas?.texture ?? options.spriteSource.textures[options.index % options.spriteSource.textures.length];

  return new Sprite({ x: options.x, y: options.y, width: spriteSize, height: spriteSize, renderMode: options.renderMode, texture, frame });
}

function createSpriteSource(atlasEnabled: boolean): SpriteSource {
  if (atlasEnabled) {
    return {
      textures: [],
      atlas: new TextureAtlas({
        texture: new Texture({ source: createTextureCanvas(["#35c2ff", "#f45b69"]) }),
        frames: {
          cyan: { x: 0, y: 0, width: spriteSize, height: spriteSize },
          red: { x: spriteSize, y: 0, width: spriteSize, height: spriteSize }
        }
      })
    };
  }

  return {
    textures: [
      new Texture({ source: createTextureCanvas(["#35c2ff"]) }),
      new Texture({ source: createTextureCanvas(["#f45b69"]) })
    ],
    atlas: null
  };
}

function createTextureCanvas(colors: readonly string[]): HTMLCanvasElement {
  const canvas = document.createElement("canvas");
  const context = canvas.getContext("2d");

  canvas.width = spriteSize * colors.length;
  canvas.height = spriteSize;

  if (context) {
    colors.forEach((color, index) => {
      context.fillStyle = color;
      context.fillRect(index * spriteSize, 0, spriteSize, spriteSize);
    });
  }

  return canvas;
}

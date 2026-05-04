import { BasicMaterial, Camera2D, Circle, Rect, Scene, Sprite, Text2D } from "raw2d";
import type { ShowcaseSceneResult } from "./ShowcaseScene.type";
import { createShowcaseTextures } from "./showcaseTextures";

export function createShowcaseScene(): ShowcaseSceneResult {
  const scene = new Scene();
  const camera = new Camera2D({ x: 0, y: 0, zoom: 1 });
  const textures = createShowcaseTextures();
  const animatedSprites: Sprite[] = [];
  const staticSprites: Sprite[] = [];
  let shapeCount = 0;
  let spriteCount = 0;
  let interactiveRect: Rect | null = null;

  for (let index = 0; index < 320; index += 1) {
    const sprite = new Sprite({
      x: 24 + (index % 40) * 22,
      y: 36 + Math.floor(index / 40) * 44,
      width: 16,
      height: 16,
      texture: textures[index % textures.length]
    });
    sprite.zIndex = 2;

    if (index % 41 === 0) {
      animatedSprites.push(sprite);
    } else {
      sprite.setRenderMode("static");
      staticSprites.push(sprite);
    }

    scene.add(sprite);
    spriteCount += 1;
  }

  for (let index = 0; index < 84; index += 1) {
    const rect = new Rect({
      x: 36 + (index % 21) * 42,
      y: 420 + Math.floor(index / 21) * 24,
      width: 30,
      height: 14,
      material: new BasicMaterial({ fillColor: index % 2 === 0 ? "#1f8a70" : "#f45b69" })
    });
    rect.setRenderMode("static");

    if (index === 4) {
      rect.name = "showcase-card";
      rect.setRenderMode("dynamic");
      interactiveRect = rect;
    }

    scene.add(rect);
    shapeCount += 1;
  }

  for (let index = 0; index < 40; index += 1) {
    const circle = new Circle({
      x: 48 + (index % 20) * 44,
      y: 520 + Math.floor(index / 20) * 34,
      radius: 9,
      material: new BasicMaterial({ fillColor: index % 2 === 0 ? "#facc15" : "#35c2ff" })
    });
    circle.setRenderMode("static");
    scene.add(circle);
    shapeCount += 1;
  }

  scene.add(
    new Text2D({
      x: 32,
      y: 24,
      text: "Raw2D showcase: sprites + shapes + labels",
      font: "20px system-ui, sans-serif",
      material: new BasicMaterial({ fillColor: "#eef6ff" })
    })
  );

  return {
    animatedSprites,
    camera,
    interactiveRect: interactiveRect ?? createFallbackInteractiveRect(scene),
    objectCount: spriteCount + shapeCount + 1,
    scene,
    shapeCount,
    spriteCount,
    staticSprites,
    worldHeight: 620,
    worldWidth: 940
  };
}

function createFallbackInteractiveRect(scene: Scene): Rect {
  const rect = new Rect({
    name: "showcase-card",
    x: 96,
    y: 430,
    width: 80,
    height: 34,
    material: new BasicMaterial({ fillColor: "#f45b69", strokeColor: "#ffd6dd", lineWidth: 2 })
  });
  scene.add(rect);
  return rect;
}

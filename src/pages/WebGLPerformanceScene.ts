import { BasicMaterial, Rect, Scene, Sprite } from "raw2d";
import type {
  WebGLPerformanceAssets,
  WebGLPerformanceScene,
  WebGLPerformanceState
} from "./WebGLPerformanceDemo.type";

const columns = 28;
const tileSize = 14;
const rowGap = 18;

export function createWebGLPerformanceScene(
  state: WebGLPerformanceState,
  assets: WebGLPerformanceAssets,
  timeSeconds = 0
): WebGLPerformanceScene {
  const scene = new Scene();
  const staticCount = Math.max(0, Math.floor(state.objectCount * 0.7));
  const dynamicCount = state.objectCount - staticCount;

  for (let index = 0; index < staticCount; index += 1) {
    scene.add(createStaticSprite(index, state, assets));
  }

  for (let index = 0; index < dynamicCount; index += 1) {
    scene.add(createDynamicRect(index, timeSeconds));
  }

  return { scene, staticCount, dynamicCount };
}

function createStaticSprite(index: number, state: WebGLPerformanceState, assets: WebGLPerformanceAssets): Sprite {
  const column = index % columns;
  const row = Math.floor(index / columns);
  const frameName = index % 2 === 0 ? "idle" : "run";
  const sprite = new Sprite({
    texture: state.textureMode === "packed" ? assets.atlas.texture : assets.separate[index % 2],
    frame: state.textureMode === "packed" ? assets.atlas.getFrame(frameName) : null,
    x: 12 + column * 18,
    y: 14 + row * rowGap,
    width: tileSize,
    height: tileSize,
    opacity: 0.95
  });

  sprite.setRenderMode(state.staticMode ? "static" : "dynamic");
  return sprite;
}

function createDynamicRect(index: number, timeSeconds: number): Rect {
  const column = index % columns;
  const row = Math.floor(index / columns);
  const wave = Math.sin(timeSeconds * 2.4 + index * 0.31);
  const drift = Math.cos(timeSeconds * 1.6 + index * 0.17);
  const rect = new Rect({
    x: 12 + column * 18 + drift * 5,
    y: 120 + row * rowGap + wave * 8,
    width: 14,
    height: 10,
    material: new BasicMaterial({ fillColor: getDynamicColor(index) })
  });

  rect.setRenderMode("dynamic");
  return rect;
}

function getDynamicColor(index: number): string {
  const colors = ["#facc15", "#4ade80", "#a78bfa", "#fb7185"];
  return colors[index % colors.length] ?? "#facc15";
}

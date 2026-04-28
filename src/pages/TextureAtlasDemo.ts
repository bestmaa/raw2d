import { Camera2D, Canvas, Scene, Sprite, Texture, TextureAtlas } from "raw2d";
import type { TextureAtlasDemoState } from "./TextureAtlasDemo.type";

const demoCanvasWidth = 520;
const demoCanvasHeight = 220;

export function createTextureAtlasDemo(): HTMLElement {
  const state: TextureAtlasDemoState = { frameName: "blue" };
  const section = document.createElement("article");
  const canvasElement = document.createElement("canvas");
  const code = document.createElement("code");
  const pre = document.createElement("pre");
  const raw2dCanvas = new Canvas({ canvas: canvasElement, width: demoCanvasWidth, height: demoCanvasHeight, backgroundColor: "#10141c" });
  const scene = new Scene();
  const camera = new Camera2D();
  const atlas = createAtlas();
  const sprite = new Sprite({ texture: atlas.texture, frame: atlas.getFrame(state.frameName), x: 260, y: 110, origin: "center" });

  section.className = "doc-section shape-demo";
  canvasElement.className = "shape-demo-canvas";
  pre.append(code);
  scene.add(sprite);
  section.append(createTitle(), canvasElement, createControls(state, atlas, raw2dCanvas, scene, camera, sprite, code), pre);
  updateDemo({ state, atlas, raw2dCanvas, scene, camera, sprite, code });
  return section;
}

function createTitle(): DocumentFragment {
  const fragment = document.createDocumentFragment();
  const title = document.createElement("h2");
  const body = document.createElement("p");
  title.textContent = "Live TextureAtlas Example";
  body.textContent = "One Texture holds multiple named frames. Sprite switches frame without changing texture.";
  fragment.append(title, body);
  return fragment;
}

function createControls(
  state: TextureAtlasDemoState,
  atlas: TextureAtlas,
  raw2dCanvas: Canvas,
  scene: Scene,
  camera: Camera2D,
  sprite: Sprite,
  code: HTMLElement
): HTMLElement {
  const controls = document.createElement("div");
  const label = document.createElement("label");
  const span = document.createElement("span");
  const select = document.createElement("select");
  controls.className = "shape-demo-controls";
  label.className = "shape-demo-control";
  span.textContent = "Frame";

  for (const frameName of atlas.getFrameNames()) {
    const option = document.createElement("option");
    option.value = frameName;
    option.textContent = frameName;
    select.append(option);
  }

  select.addEventListener("change", () => {
    state.frameName = select.value;
    updateDemo({ state, atlas, raw2dCanvas, scene, camera, sprite, code });
  });
  label.append(span, select);
  controls.append(label);
  return controls;
}

function updateDemo(options: {
  readonly state: TextureAtlasDemoState;
  readonly atlas: TextureAtlas;
  readonly raw2dCanvas: Canvas;
  readonly scene: Scene;
  readonly camera: Camera2D;
  readonly sprite: Sprite;
  readonly code: HTMLElement;
}): void {
  const frame = options.atlas.getFrame(options.state.frameName);
  options.sprite.setFrame(frame);
  options.sprite.setSize(frame.width * 2, frame.height * 2);
  options.raw2dCanvas.render(options.scene, options.camera);
  options.code.textContent = createCode(options.state.frameName);
}

function createAtlas(): TextureAtlas {
  const canvas = document.createElement("canvas");
  const context = canvas.getContext("2d");
  canvas.width = 96;
  canvas.height = 32;

  if (context) {
    drawTile(context, 0, "#35c2ff");
    drawTile(context, 32, "#f45b69");
    drawTile(context, 64, "#facc15");
  }

  return new TextureAtlas({
    texture: new Texture({ source: canvas, width: 96, height: 32 }),
    frames: {
      blue: { x: 0, y: 0, width: 32, height: 32 },
      red: { x: 32, y: 0, width: 32, height: 32 },
      yellow: { x: 64, y: 0, width: 32, height: 32 }
    }
  });
}

function drawTile(context: CanvasRenderingContext2D, x: number, color: string): void {
  context.fillStyle = color;
  context.fillRect(x, 0, 32, 32);
  context.fillStyle = "#10141c";
  context.fillRect(x + 8, 8, 16, 16);
}

function createCode(frameName: string): string {
  return `const atlas = new TextureAtlas({
  texture,
  frames: {
    blue: { x: 0, y: 0, width: 32, height: 32 },
    red: { x: 32, y: 0, width: 32, height: 32 },
    yellow: { x: 64, y: 0, width: 32, height: 32 }
  }
});

const sprite = new Sprite({
  texture: atlas.texture,
  frame: atlas.getFrame("${frameName}")
});`;
}

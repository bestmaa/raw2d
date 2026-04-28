import { Camera2D, Canvas, Scene, Sprite, SpriteAnimationClip, SpriteAnimator, Texture, TextureAtlas } from "raw2d";
import type { SpriteAnimationDemoState } from "./SpriteAnimationDemo.type";

const demoCanvasWidth = 520;
const demoCanvasHeight = 220;

export function createSpriteAnimationDemo(): HTMLElement {
  const state: SpriteAnimationDemoState = { fps: 6, playing: true, frameIndex: 0 };
  const section = document.createElement("article");
  const canvasElement = document.createElement("canvas");
  const code = document.createElement("code");
  const pre = document.createElement("pre");
  const raw2dCanvas = new Canvas({ canvas: canvasElement, width: demoCanvasWidth, height: demoCanvasHeight, backgroundColor: "#10141c" });
  const scene = new Scene();
  const camera = new Camera2D();
  const atlas = createAtlas();
  const clip = createClip(atlas, state.fps);
  const sprite = new Sprite({ texture: atlas.texture, frame: atlas.getFrame("a"), x: 260, y: 110, origin: "center", width: 96, height: 96 });
  const animator = new SpriteAnimator({ sprite, clip });

  section.className = "doc-section shape-demo";
  canvasElement.className = "shape-demo-canvas";
  pre.append(code);
  scene.add(sprite);
  section.append(createTitle(), canvasElement, createControls(state, atlas, animator, code), pre);
  startLoop({ raw2dCanvas, scene, camera, animator, state, code });
  return section;
}

function createTitle(): DocumentFragment {
  const fragment = document.createDocumentFragment();
  const title = document.createElement("h2");
  const body = document.createElement("p");
  title.textContent = "Live Sprite Animation";
  body.textContent = "SpriteAnimator changes the Sprite frame when you call update(deltaSeconds).";
  fragment.append(title, body);
  return fragment;
}

function createControls(state: SpriteAnimationDemoState, atlas: TextureAtlas, animator: SpriteAnimator, code: HTMLElement): HTMLElement {
  const controls = document.createElement("div");
  const button = document.createElement("button");
  controls.className = "shape-demo-controls";
  button.type = "button";
  button.textContent = "Pause";
  button.addEventListener("click", () => {
    state.playing = !state.playing;
    button.textContent = state.playing ? "Pause" : "Play";
    state.playing ? animator.play() : animator.pause();
  });
  controls.append(button, createFpsControl(state, atlas, animator, code));
  return controls;
}

function createFpsControl(state: SpriteAnimationDemoState, atlas: TextureAtlas, animator: SpriteAnimator, code: HTMLElement): HTMLElement {
  const label = document.createElement("label");
  const span = document.createElement("span");
  const input = document.createElement("input");
  label.className = "shape-demo-control";
  span.textContent = `FPS: ${state.fps}`;
  input.type = "range";
  input.min = "1";
  input.max = "16";
  input.value = String(state.fps);
  input.addEventListener("input", () => {
    state.fps = Number(input.value);
    span.textContent = `FPS: ${state.fps}`;
    animator.setClip(createClip(atlas, state.fps), state.playing);
    code.textContent = createCode(state.fps);
  });
  label.append(span, input);
  return label;
}

function startLoop(options: {
  readonly raw2dCanvas: Canvas;
  readonly scene: Scene;
  readonly camera: Camera2D;
  readonly animator: SpriteAnimator;
  readonly state: SpriteAnimationDemoState;
  readonly code: HTMLElement;
}): void {
  let lastTime = performance.now();
  const frame = (time: number): void => {
    const delta = (time - lastTime) / 1000;
    lastTime = time;
    options.animator.update(delta);
    options.state.frameIndex = options.animator.getFrameIndex();
    options.raw2dCanvas.render(options.scene, options.camera);
    options.code.textContent = createCode(options.state.fps);
    requestAnimationFrame(frame);
  };
  requestAnimationFrame(frame);
}

function createAtlas(): TextureAtlas {
  const canvas = document.createElement("canvas");
  const context = canvas.getContext("2d");
  canvas.width = 96;
  canvas.height = 32;

  if (context) {
    drawFrame(context, 0, "#35c2ff", 8);
    drawFrame(context, 32, "#f45b69", 12);
    drawFrame(context, 64, "#facc15", 16);
  }

  return new TextureAtlas({
    texture: new Texture({ source: canvas, width: 96, height: 32 }),
    frames: {
      a: { x: 0, y: 0, width: 32, height: 32 },
      b: { x: 32, y: 0, width: 32, height: 32 },
      c: { x: 64, y: 0, width: 32, height: 32 }
    }
  });
}

function createClip(atlas: TextureAtlas, fps: number): SpriteAnimationClip {
  return new SpriteAnimationClip({
    frames: [atlas.getFrame("a"), atlas.getFrame("b"), atlas.getFrame("c")],
    fps,
    loop: true,
    name: "pulse"
  });
}

function drawFrame(context: CanvasRenderingContext2D, x: number, color: string, size: number): void {
  context.fillStyle = color;
  context.fillRect(x, 0, 32, 32);
  context.fillStyle = "#10141c";
  context.fillRect(x + (32 - size) / 2, (32 - size) / 2, size, size);
}

function createCode(fps: number): string {
  return `const clip = new SpriteAnimationClip({
  frames: [atlas.getFrame("a"), atlas.getFrame("b"), atlas.getFrame("c")],
  fps: ${fps},
  loop: true
});

const animator = new SpriteAnimator({ sprite, clip });

function animate(deltaSeconds: number): void {
  animator.update(deltaSeconds);
  raw2dCanvas.render(scene, camera);
}`;
}

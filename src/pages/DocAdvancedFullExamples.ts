export const fullTextureAtlasExample = `import {
  Camera2D,
  Canvas,
  Scene,
  Sprite,
  TextureAtlas,
  TextureLoader
} from "raw2d";

const canvasElement = document.querySelector<HTMLCanvasElement>("#raw2d-canvas");

if (!canvasElement) {
  throw new Error("Canvas element not found.");
}

const raw2dCanvas = new Canvas({ canvas: canvasElement, backgroundColor: "#10141c" });
const scene = new Scene();
const camera = new Camera2D();
const texture = await new TextureLoader().load("/atlas.png");

const atlas = new TextureAtlas({
  texture,
  frames: {
    idle: { x: 0, y: 0, width: 32, height: 32 },
    run: { x: 32, y: 0, width: 32, height: 32 }
  }
});

scene.add(new Sprite({
  texture: atlas.texture,
  frame: atlas.getFrame("idle"),
  x: 120,
  y: 80,
  width: 96,
  height: 96
}));

raw2dCanvas.render(scene, camera);`;

export const fullWebGLPathExample = `import {
  BasicMaterial,
  Camera2D,
  Canvas,
  Rect,
  Scene,
  WebGLRenderer2D,
  isWebGL2Available
} from "raw2d";

const canvasElement = document.querySelector<HTMLCanvasElement>("#raw2d-canvas");

if (!canvasElement) {
  throw new Error("Canvas element not found.");
}

const scene = new Scene();
const camera = new Camera2D();
const renderer = isWebGL2Available({ canvas: canvasElement })
  ? new WebGLRenderer2D({ canvas: canvasElement, backgroundColor: "#10141c" })
  : new Canvas({ canvas: canvasElement, backgroundColor: "#10141c" });

scene.add(new Rect({
  x: 80,
  y: 80,
  width: 180,
  height: 110,
  material: new BasicMaterial({ fillColor: "#38bdf8" })
}));

renderer.render(scene, camera);`;

export const fullInteractionPathExample = `import {
  BasicMaterial,
  Camera2D,
  Canvas,
  InteractionController,
  Rect,
  Scene
} from "raw2d";

const canvasElement = document.querySelector<HTMLCanvasElement>("#raw2d-canvas");

if (!canvasElement) {
  throw new Error("Canvas element not found.");
}

const renderer = new Canvas({ canvas: canvasElement, backgroundColor: "#10141c" });
const scene = new Scene();
const camera = new Camera2D();

const rect = new Rect({
  x: 80,
  y: 90,
  width: 160,
  height: 90,
  material: new BasicMaterial({ fillColor: "#f45b69" })
});

scene.add(rect);

new InteractionController({
  canvas: canvasElement,
  scene,
  camera,
  onChange: () => renderer.render(scene, camera)
}).attach(rect, { drag: true, resize: true });

renderer.render(scene, camera);`;

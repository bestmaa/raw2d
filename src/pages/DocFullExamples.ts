export const fullRectExample = `import { BasicMaterial, Camera2D, Canvas, Rect, Scene } from "raw2d";

const canvasElement = document.querySelector<HTMLCanvasElement>("#raw2d-canvas");

if (!canvasElement) {
  throw new Error("Canvas element not found.");
}

const rawCanvas = new Canvas({ canvas: canvasElement, backgroundColor: "#10141c" });
const scene = new Scene();
const camera = new Camera2D();

const rect = new Rect({
  x: 100,
  y: 80,
  width: 200,
  height: 120,
  material: new BasicMaterial({ fillColor: "#f45b69" })
});

scene.add(rect);
rawCanvas.render(scene, camera);`;

export const fullCircleExample = `import { BasicMaterial, Camera2D, Canvas, Circle, Scene } from "raw2d";

const canvasElement = document.querySelector<HTMLCanvasElement>("#raw2d-canvas");

if (!canvasElement) {
  throw new Error("Canvas element not found.");
}

const rawCanvas = new Canvas({ canvas: canvasElement, backgroundColor: "#10141c" });
const scene = new Scene();
const camera = new Camera2D();

const circle = new Circle({
  x: 260,
  y: 130,
  radius: 60,
  material: new BasicMaterial({ fillColor: "#35c2ff" })
});

scene.add(circle);
rawCanvas.render(scene, camera);`;

export const fullEllipseExample = `import { BasicMaterial, Camera2D, Canvas, Ellipse, Scene } from "raw2d";

const canvasElement = document.querySelector<HTMLCanvasElement>("#raw2d-canvas");

if (!canvasElement) {
  throw new Error("Canvas element not found.");
}

const rawCanvas = new Canvas({ canvas: canvasElement, backgroundColor: "#10141c" });
const scene = new Scene();
const camera = new Camera2D();

const ellipse = new Ellipse({
  x: 260,
  y: 130,
  radiusX: 95,
  radiusY: 52,
  material: new BasicMaterial({ fillColor: "#a78bfa" })
});

scene.add(ellipse);
rawCanvas.render(scene, camera);`;

export const fullArcExample = `import { Arc, BasicMaterial, Camera2D, Canvas, Scene } from "raw2d";

const canvasElement = document.querySelector<HTMLCanvasElement>("#raw2d-canvas");

if (!canvasElement) {
  throw new Error("Canvas element not found.");
}

const rawCanvas = new Canvas({ canvas: canvasElement, backgroundColor: "#10141c" });
const scene = new Scene();
const camera = new Camera2D();

const arc = new Arc({
  x: 260,
  y: 130,
  radiusX: 110,
  radiusY: 70,
  startAngle: 0,
  endAngle: Math.PI * 1.35,
  material: new BasicMaterial({ strokeColor: "#f97316", lineWidth: 8 })
});

scene.add(arc);
rawCanvas.render(scene, camera);`;

export const fullLineExample = `import { BasicMaterial, Camera2D, Canvas, Line, Scene } from "raw2d";

const canvasElement = document.querySelector<HTMLCanvasElement>("#raw2d-canvas");

if (!canvasElement) {
  throw new Error("Canvas element not found.");
}

const rawCanvas = new Canvas({ canvas: canvasElement, backgroundColor: "#10141c" });
const scene = new Scene();
const camera = new Camera2D();

const line = new Line({
  x: 100,
  y: 120,
  startX: 0,
  startY: 0,
  endX: 260,
  endY: 80,
  material: new BasicMaterial({ strokeColor: "#facc15", lineWidth: 6 })
});

scene.add(line);
rawCanvas.render(scene, camera);`;

export const fullPolylineExample = `import { BasicMaterial, Camera2D, Canvas, Polyline, Scene } from "raw2d";

const canvasElement = document.querySelector<HTMLCanvasElement>("#raw2d-canvas");

if (!canvasElement) {
  throw new Error("Canvas element not found.");
}

const rawCanvas = new Canvas({ canvas: canvasElement, backgroundColor: "#10141c" });
const scene = new Scene();
const camera = new Camera2D();

const polyline = new Polyline({
  x: 85,
  y: 70,
  points: [
    { x: 0, y: 120 },
    { x: 120, y: 20 },
    { x: 320, y: 150 }
  ],
  material: new BasicMaterial({ strokeColor: "#38bdf8", lineWidth: 6 })
});

scene.add(polyline);
rawCanvas.render(scene, camera);`;

export const fullPolygonExample = `import { BasicMaterial, Camera2D, Canvas, Polygon, Scene } from "raw2d";

const canvasElement = document.querySelector<HTMLCanvasElement>("#raw2d-canvas");

if (!canvasElement) {
  throw new Error("Canvas element not found.");
}

const rawCanvas = new Canvas({ canvas: canvasElement, backgroundColor: "#10141c" });
const scene = new Scene();
const camera = new Camera2D();

const polygon = new Polygon({
  x: 110,
  y: 55,
  points: [
    { x: 80, y: 0 },
    { x: 260, y: 70 },
    { x: 40, y: 160 }
  ],
  material: new BasicMaterial({
    fillColor: "#22c55e",
    strokeColor: "#bbf7d0",
    lineWidth: 3
  })
});

scene.add(polygon);
rawCanvas.render(scene, camera);`;

export const fullText2DExample = `import { BasicMaterial, Camera2D, Canvas, Scene, Text2D } from "raw2d";

const canvasElement = document.querySelector<HTMLCanvasElement>("#raw2d-canvas");

if (!canvasElement) {
  throw new Error("Canvas element not found.");
}

const rawCanvas = new Canvas({ canvas: canvasElement, backgroundColor: "#10141c" });
const scene = new Scene();
const camera = new Camera2D();

const text = new Text2D({
  x: 80,
  y: 135,
  text: "Hello Raw2D",
  font: "32px sans-serif",
  material: new BasicMaterial({ fillColor: "#f5f7fb" })
});

scene.add(text);
rawCanvas.render(scene, camera);`;

export const fullTextureExample = `import { TextureLoader } from "raw2d";

const loader = new TextureLoader();
const texture = await loader.load("/sprite.png");

console.log(texture.width, texture.height);`;

export const fullSpriteExample = `import { Camera2D, Canvas, Scene, Sprite, TextureLoader } from "raw2d";

const canvasElement = document.querySelector<HTMLCanvasElement>("#raw2d-canvas");

if (!canvasElement) {
  throw new Error("Canvas element not found.");
}

const rawCanvas = new Canvas({ canvas: canvasElement, backgroundColor: "#10141c" });
const scene = new Scene();
const camera = new Camera2D();
const texture = await new TextureLoader().load("/sprite.png");

const sprite = new Sprite({
  x: 120,
  y: 80,
  texture,
  width: 128,
  height: 128,
  opacity: 1
});

scene.add(sprite);
rawCanvas.render(scene, camera);`;

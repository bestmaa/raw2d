#!/usr/bin/env node
import { mkdir, writeFile } from "node:fs/promises";
import path from "node:path";

const options = parseArgs(process.argv.slice(2));

if (!options.out) {
  fail("Missing required --out <directory>.");
}

const renderer = options.renderer ?? "webgl";

if (renderer !== "canvas" && renderer !== "webgl") {
  fail("--renderer must be canvas or webgl.");
}

const target = path.resolve(options.out);

await createRaw2DShowcase({
  target,
  renderer,
  title: options.title ?? "Raw2D Showcase"
});

console.log(`Raw2D showcase created at ${target}`);

export async function createRaw2DShowcase(config) {
  await mkdir(config.target, { recursive: true });
  await writeFile(path.join(config.target, "index.html"), indexHtml(config.title));
  await writeFile(path.join(config.target, "main.ts"), mainSource(config.renderer));
}

function parseArgs(args) {
  const result = {};

  for (let index = 0; index < args.length; index += 1) {
    const arg = args[index];
    const value = args[index + 1];

    if (arg === "--out") {
      result.out = requireValue(arg, value);
      index += 1;
    } else if (arg === "--renderer") {
      result.renderer = requireValue(arg, value);
      index += 1;
    } else if (arg === "--title") {
      result.title = requireValue(arg, value);
      index += 1;
    } else {
      fail(`Unknown argument: ${arg}`);
    }
  }

  return result;
}

function requireValue(name, value) {
  if (!value || value.startsWith("--")) {
    fail(`Missing value for ${name}.`);
  }

  return value;
}

function indexHtml(title) {
  return `<!doctype html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>${title}</title>
    <style>body{margin:0;background:#0b1018;color:#d7f3ff;font:14px monospace}canvas{display:block}</style>
  </head>
  <body>
    <canvas id="raw2d-canvas"></canvas>
    <script type="module" src="./main.ts"></script>
  </body>
</html>
`;
}

function mainSource(renderer) {
  const rendererImports = renderer === "webgl"
    ? `  WebGLRenderer2D,
  isWebGL2Available,`
    : "";
  const rendererSource = renderer === "webgl"
    ? `isWebGL2Available({ canvas: canvasElement })
  ? new WebGLRenderer2D({ canvas: canvasElement, width: 960, height: 540 })
  : new Canvas({ canvas: canvasElement, width: 960, height: 540 })`
    : `new Canvas({ canvas: canvasElement, width: 960, height: 540 })`;

  return `import {
  BasicMaterial,
  Camera2D,
  Canvas,
  Circle,
  Line,
  Rect,
  Scene,
  Text2D,
${rendererImports}
} from "raw2d";
import type { Renderer2DLike } from "raw2d";

const canvasElement = document.querySelector<HTMLCanvasElement>("#raw2d-canvas");

if (!canvasElement) {
  throw new Error("Canvas element not found.");
}

const scene = new Scene();
const camera = new Camera2D({ x: 0, y: 0, zoom: 1 });
const renderer: Renderer2DLike = ${rendererSource};

scene.add(new Rect({
  x: 60,
  y: 60,
  width: 220,
  height: 120,
  material: new BasicMaterial({ fillColor: "#35c2ff", strokeColor: "#ffffff", lineWidth: 2 })
}));

scene.add(new Circle({
  x: 390,
  y: 120,
  radius: 64,
  material: new BasicMaterial({ fillColor: "#f45b69" })
}));

scene.add(new Line({
  x: 560,
  y: 90,
  startX: 0,
  startY: 0,
  endX: 260,
  endY: 90,
  material: new BasicMaterial({ strokeColor: "#facc15", lineWidth: 8 })
}));

for (let index = 0; index < 36; index += 1) {
  scene.add(new Rect({
    x: 64 + (index % 12) * 52,
    y: 260 + Math.floor(index / 12) * 48,
    width: 34,
    height: 28,
    renderMode: index % 2 === 0 ? "static" : "dynamic",
    material: new BasicMaterial({ fillColor: index % 3 === 0 ? "#35c2ff" : "#f45b69" })
  }));
}

scene.add(new Text2D({
  x: 60,
  y: 500,
  text: "Raw2D explicit Canvas/WebGL showcase",
  font: "28px sans-serif",
  material: new BasicMaterial({ fillColor: "#ffffff" })
}));

renderer.render(scene, camera);
`;
}

function fail(message) {
  console.error(message);
  process.exit(1);
}

#!/usr/bin/env node
import { mkdir, writeFile } from "node:fs/promises";
import path from "node:path";

const options = parseArgs(process.argv.slice(2));

if (!options.out) {
  fail("Missing required --out <directory>.");
}

const renderer = options.renderer ?? "canvas";
const shape = options.shape ?? "rect";

if (renderer !== "canvas" && renderer !== "webgl") {
  fail("--renderer must be canvas or webgl.");
}

if (!["rect", "circle", "text"].includes(shape)) {
  fail("--shape must be rect, circle, or text.");
}

const target = path.resolve(options.out);

await createRaw2DExample({
  target,
  title: options.title ?? "Raw2D Example",
  renderer,
  shape
});

console.log(`Raw2D example created at ${target}`);

export async function createRaw2DExample(config) {
  await mkdir(config.target, { recursive: true });
  await writeFile(path.join(config.target, "index.html"), indexHtml(config.title));
  await writeFile(path.join(config.target, "main.ts"), mainSource(config));
}

function parseArgs(args) {
  const result = {};

  for (let index = 0; index < args.length; index += 1) {
    const arg = args[index];
    const value = args[index + 1];

    if (arg === "--out") {
      result.out = requireValue(arg, value);
      index += 1;
    } else if (arg === "--title") {
      result.title = requireValue(arg, value);
      index += 1;
    } else if (arg === "--renderer") {
      result.renderer = requireValue(arg, value);
      index += 1;
    } else if (arg === "--shape") {
      result.shape = requireValue(arg, value);
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
  </head>
  <body>
    <canvas id="raw2d-canvas"></canvas>
    <script type="module" src="./main.ts"></script>
  </body>
</html>
`;
}

function mainSource(config) {
  const shapeImport = config.shape === "circle"
    ? "Circle"
    : config.shape === "text"
      ? "Text2D"
      : "Rect";
  const rendererImports = config.renderer === "webgl"
    ? `  WebGLRenderer2D,
  isWebGL2Available,`
    : "";
  const rendererSource = config.renderer === "webgl"
    ? `isWebGL2Available({ canvas: canvasElement })
  ? new WebGLRenderer2D({ canvas: canvasElement, width: 640, height: 360 })
  : new Canvas({ canvas: canvasElement, width: 640, height: 360 })`
    : `new Canvas({ canvas: canvasElement, width: 640, height: 360 })`;

  return `import {
  BasicMaterial,
  Camera2D,
  Canvas,
  ${shapeImport},
  Scene,
${rendererImports}
} from "raw2d";
import type { Renderer2DLike } from "raw2d";

const canvasElement = document.querySelector<HTMLCanvasElement>("#raw2d-canvas");

if (!canvasElement) {
  throw new Error("Canvas element not found.");
}

const scene = new Scene();
const camera = new Camera2D();
const renderer: Renderer2DLike = ${rendererSource};

${objectSource(config.shape)}

renderer.render(scene, camera);
`;
}

function objectSource(shape) {
  if (shape === "circle") {
    return `scene.add(new Circle({
  x: 260,
  y: 160,
  radius: 64,
  material: new BasicMaterial({ fillColor: "#35c2ff" })
}));`;
  }

  if (shape === "text") {
    return `scene.add(new Text2D({
  x: 120,
  y: 180,
  text: "Raw2D",
  font: "40px sans-serif",
  material: new BasicMaterial({ fillColor: "#ffffff" })
}));`;
  }

  return `scene.add(new Rect({
  x: 180,
  y: 120,
  width: 180,
  height: 100,
  material: new BasicMaterial({ fillColor: "#35c2ff" })
}));`;
}

function fail(message) {
  console.error(message);
  process.exit(1);
}

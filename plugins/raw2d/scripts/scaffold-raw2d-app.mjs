#!/usr/bin/env node
import { mkdir, readFile, writeFile } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

const pluginRoot = fileURLToPath(new URL("../", import.meta.url));
const repoRoot = path.resolve(pluginRoot, "../..");

const options = parseArgs(process.argv.slice(2));

if (!options.out) {
  fail("Missing required --out <directory>.");
}

const renderer = options.renderer ?? "canvas";

if (renderer !== "canvas" && renderer !== "webgl") {
  fail("--renderer must be canvas or webgl.");
}

const raw2dDependency = options.raw2dDependency ?? `^${await readWorkspaceVersion()}`;
const target = path.resolve(options.out);

await createRaw2DApp({
  target,
  name: options.name ?? path.basename(target),
  renderer,
  raw2dDependency
});

console.log(`Raw2D app scaffolded at ${target}`);

export async function createRaw2DApp(config) {
  await mkdir(path.join(config.target, "src"), { recursive: true });
  await writeFile(path.join(config.target, "package.json"), packageJson(config));
  await writeFile(path.join(config.target, "index.html"), indexHtml(config));
  await writeFile(path.join(config.target, "tsconfig.json"), tsConfig());
  await writeFile(path.join(config.target, "src", "main.ts"), mainSource(config.renderer));
}

function parseArgs(args) {
  const result = {};

  for (let index = 0; index < args.length; index += 1) {
    const arg = args[index];
    const value = args[index + 1];

    if (arg === "--out") {
      result.out = requireValue(arg, value);
      index += 1;
    } else if (arg === "--name") {
      result.name = requireValue(arg, value);
      index += 1;
    } else if (arg === "--renderer") {
      result.renderer = requireValue(arg, value);
      index += 1;
    } else if (arg === "--raw2d-dependency") {
      result.raw2dDependency = requireValue(arg, value);
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

async function readWorkspaceVersion() {
  const text = await readFile(path.join(repoRoot, "package.json"), "utf8");
  const json = JSON.parse(text);

  return String(json.version);
}

function packageJson(config) {
  return `${JSON.stringify(
    {
      name: normalizePackageName(config.name),
      private: true,
      version: "0.0.0",
      type: "module",
      scripts: {
        dev: "vite --host 0.0.0.0",
        build: "tsc --noEmit && vite build",
        preview: "vite preview --host 0.0.0.0"
      },
      dependencies: {
        raw2d: config.raw2dDependency
      },
      devDependencies: {
        typescript: "~6.0.2",
        vite: "^8.0.10"
      }
    },
    null,
    2
  )}\n`;
}

function normalizePackageName(name) {
  return name
    .toLowerCase()
    .replace(/[^a-z0-9-]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .replace(/-{2,}/g, "-") || "raw2d-app";
}

function indexHtml(config) {
  return `<!doctype html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>${config.name}</title>
  </head>
  <body>
    <canvas id="raw2d-canvas"></canvas>
    <script type="module" src="/src/main.ts"></script>
  </body>
</html>
`;
}

function tsConfig() {
  return `{
  "compilerOptions": {
    "target": "ES2023",
    "module": "ESNext",
    "lib": ["ES2023", "DOM"],
    "moduleResolution": "bundler",
    "strict": true,
    "verbatimModuleSyntax": true,
    "noUnusedLocals": true,
    "noUnusedParameters": true,
    "skipLibCheck": true
  },
  "include": ["src"]
}
`;
}

function mainSource(renderer) {
  const imports = renderer === "webgl"
    ? `  WebGLRenderer2D,
  isWebGL2Available,`
    : "";
  const rendererExpression = renderer === "webgl"
    ? `isWebGL2Available({ canvas: canvasElement })
  ? new WebGLRenderer2D({ canvas: canvasElement, width: 800, height: 500 })
  : new Canvas({ canvas: canvasElement, width: 800, height: 500 })`
    : `new Canvas({ canvas: canvasElement, width: 800, height: 500 })`;

  return `import {
  BasicMaterial,
  Camera2D,
  Canvas,
  Circle,
  Rect,
  Scene,
  Text2D,${imports}
} from "raw2d";
import type { Renderer2DLike } from "raw2d";

const canvasElement = document.querySelector<HTMLCanvasElement>("#raw2d-canvas");

if (!canvasElement) {
  throw new Error("Canvas element not found.");
}

const scene = new Scene();
const camera = new Camera2D({ x: 0, y: 0, zoom: 1 });
const renderer: Renderer2DLike = ${rendererExpression};

scene.add(new Rect({
  x: 120,
  y: 120,
  width: 180,
  height: 100,
  material: new BasicMaterial({ fillColor: "#35c2ff" })
}));
scene.add(new Circle({
  x: 380,
  y: 170,
  radius: 52,
  material: new BasicMaterial({ fillColor: "#f97316" })
}));
scene.add(new Text2D({
  x: 120,
  y: 280,
  text: "Raw2D app",
  font: "32px sans-serif",
  material: new BasicMaterial({ fillColor: "#ffffff" })
}));

function animate(): void {
  renderer.render(scene, camera);
  requestAnimationFrame(animate);
}

animate();
`;
}

function fail(message) {
  console.error(message);
  process.exit(1);
}

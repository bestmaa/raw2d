import { mkdir, mkdtemp, readFile, rm, writeFile } from "node:fs/promises";
import { tmpdir } from "node:os";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { spawn } from "node:child_process";

const root = fileURLToPath(new URL("../", import.meta.url));
const packageJson = JSON.parse(await readFile(new URL("../package.json", import.meta.url), "utf8"));
const version = packageJson.version;
const workspace = await mkdtemp(path.join(tmpdir(), `raw2d-consumer-${version}-`));

try {
  await createConsumerProject(workspace);
  const packageTarballs = await packWorkspacePackages(workspace);
  await run("npm", ["init", "-y"], workspace);
  await run("npm", ["install", ...packageTarballs, "vite@^8.0.10", "typescript@~6.0.2"], workspace);
  await run("npx", ["tsc", "--noEmit"], workspace);
  await run("npx", ["vite", "build"], workspace);
  await run("node", ["runtime-check.mjs"], workspace);
} finally {
  await rm(workspace, { recursive: true, force: true });
}

async function packWorkspacePackages(destination) {
  const packageDirectories = [
    "packages/core",
    "packages/interaction",
    "packages/text",
    "packages/sprite",
    "packages/canvas",
    "packages/webgl",
    "packages/effects",
    "packages/raw2d"
  ];
  const tarballs = [];

  for (const packageDirectory of packageDirectories) {
    const output = await runForOutput("npm", ["pack", "--silent", "--pack-destination", destination], path.join(root, packageDirectory));
    const fileName = output.trim().split(/\r?\n/).filter(Boolean).at(-1);

    if (!fileName) {
      throw new Error(`npm pack did not return a tarball for ${packageDirectory}`);
    }

    tarballs.push(path.join(destination, fileName));
  }

  return tarballs;
}

async function createConsumerProject(directory) {
  await mkdir(path.join(directory, "src"), { recursive: true });
  await writeFile(path.join(directory, "index.html"), `<!doctype html>
<html lang="en">
  <head><meta charset="UTF-8" /><title>Raw2D Consumer</title></head>
  <body><canvas id="raw2d-canvas"></canvas><script type="module" src="/src/main.ts"></script></body>
</html>
`);
  await writeFile(path.join(directory, "tsconfig.json"), `{
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
`);
  await writeFile(path.join(directory, "runtime-check.mjs"), `const m = await import("raw2d");
if (m.createWebGLShapeBatch !== undefined) {
  throw new Error("raw2d umbrella leaked WebGL internals");
}
console.log("runtime-ok", typeof m.Canvas, typeof m.WebGLRenderer2D);
`);
  await writeFile(path.join(directory, "src/main.ts"), getMainSource());
}

function getMainSource() {
  return `import {
  BasicMaterial,
  Camera2D,
  Canvas,
  InteractionController,
  Rect,
  Scene,
  Sprite,
  Text2D,
  Texture,
  TextureAtlasPacker,
  WebGLRenderer2D,
  isWebGL2Available
} from "raw2d";
import {
  analyzeWebGLSpriteBatching,
  createWebGLShapeBatch,
  estimateWebGLSpriteTextureBinds,
  sortWebGLSpritesForBatching
} from "raw2d-webgl";
import { TextureAtlasPacker as FocusedPacker } from "raw2d-sprite";
import type { Renderer2DLike, WebGLRenderStats } from "raw2d";

const canvasElement = document.querySelector<HTMLCanvasElement>("#raw2d-canvas");

if (!canvasElement) {
  throw new Error("Canvas element not found.");
}

const scene = new Scene();
const camera = new Camera2D();
const renderer: Renderer2DLike = isWebGL2Available({ canvas: canvasElement })
  ? new WebGLRenderer2D({ canvas: canvasElement, width: 320, height: 180 })
  : new Canvas({ canvas: canvasElement, width: 320, height: 180 });
const rect = new Rect({ width: 80, height: 48, material: new BasicMaterial({ fillColor: "#35c2ff" }) });
const source = { width: 8, height: 8 } as CanvasImageSource;
const texture = new Texture({ source, width: 8, height: 8 });
const sprite = new Sprite({ texture, width: 16, height: 16 });
const text = new Text2D({ text: "Raw2D", material: new BasicMaterial({ fillColor: "#ffffff" }) });
const atlasPacker = new TextureAtlasPacker({ padding: 1 });
const focusedPacker = new FocusedPacker({ padding: 1 });

scene.add(rect).add(sprite).add(text);
renderer.render(scene, camera);

new InteractionController({ canvas: canvasElement, scene, camera });
console.log(atlasPacker, focusedPacker, typeof createWebGLShapeBatch);
console.log(
  sortWebGLSpritesForBatching({ sprites: [sprite] }).length,
  estimateWebGLSpriteTextureBinds({ sprites: [sprite] }),
  analyzeWebGLSpriteBatching({ sprites: [sprite] }).spriteCount
);
console.log((renderer.getStats() as WebGLRenderStats | ReturnType<typeof renderer.getStats>).objects);
`;
}

async function run(command, args, cwd) {
  const child = spawn(command, args, {
    cwd,
    env: { ...process.env, npm_config_fund: "false", npm_config_audit: "false" },
    shell: process.platform === "win32",
    stdio: "inherit"
  });
  const code = await new Promise((resolve) => {
    child.on("close", resolve);
  });

  if (code !== 0) {
    throw new Error(`Command failed: ${command} ${args.join(" ")}`);
  }
}

async function runForOutput(command, args, cwd) {
  const child = spawn(command, args, {
    cwd,
    env: { ...process.env, npm_config_fund: "false", npm_config_audit: "false" },
    shell: process.platform === "win32",
    stdio: ["ignore", "pipe", "inherit"]
  });
  let output = "";

  child.stdout.on("data", (chunk) => {
    output += chunk.toString();
  });

  const code = await new Promise((resolve) => {
    child.on("close", resolve);
  });

  if (code !== 0) {
    throw new Error(`Command failed: ${command} ${args.join(" ")}`);
  }

  return output;
}

console.log(`Consumer smoke passed for raw2d@${version} from ${root}`);

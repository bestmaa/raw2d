import { mkdir, mkdtemp, readFile, rm, writeFile } from "node:fs/promises";
import { tmpdir } from "node:os";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { spawn } from "node:child_process";

const root = fileURLToPath(new URL("../", import.meta.url));
const packageJson = JSON.parse(await readFile(new URL("../package.json", import.meta.url), "utf8"));
const version = packageJson.version;
const workspace = await mkdtemp(path.join(tmpdir(), `raw2d-umbrella-${version}-`));

try {
  await createProject(workspace);
  const tarballs = await packRuntimePackages(workspace);
  await run("npm", ["init", "-y"], workspace);
  await run("npm", ["install", ...tarballs, "vite@^8.0.10", "typescript@~6.0.2"], workspace);
  await run("npx", ["tsc", "--noEmit"], workspace);
  await run("npx", ["vite", "build"], workspace);
  await run("node", ["runtime-check.mjs"], workspace);
} finally {
  await rm(workspace, { recursive: true, force: true });
}

async function packRuntimePackages(destination) {
  const directories = [
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

  for (const directory of directories) {
    const output = await runForOutput("npm", ["pack", "--silent", "--pack-destination", destination], path.join(root, directory));
    const fileName = output.trim().split(/\r?\n/).filter(Boolean).at(-1);

    if (!fileName) {
      throw new Error(`npm pack did not return a tarball for ${directory}`);
    }

    tarballs.push(path.join(destination, fileName));
  }

  return tarballs;
}

async function createProject(directory) {
  await mkdir(path.join(directory, "src"), { recursive: true });
  await writeFile(path.join(directory, "index.html"), `<!doctype html>
<html lang="en">
  <head><meta charset="UTF-8" /><title>Raw2D Umbrella Smoke</title></head>
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
    "skipLibCheck": true
  },
  "include": ["src"]
}
`);
  await writeFile(path.join(directory, "runtime-check.mjs"), `const m = await import("raw2d");
if (typeof m.Scene !== "function" || typeof m.CanvasRenderer !== "function") {
  throw new Error("raw2d umbrella exports are missing runtime classes");
}
if (m.createWebGLShapeBatch !== undefined) {
  throw new Error("raw2d umbrella leaked WebGL internals");
}
console.log("umbrella-runtime-ok", typeof m.Scene, typeof m.CanvasRenderer);
`);
  await writeFile(path.join(directory, "src/main.ts"), getMainSource());
}

function getMainSource() {
  return `import { BasicMaterial, Camera2D, CanvasRenderer, Rect, Scene, Text2D } from "raw2d";

const canvas = document.querySelector<HTMLCanvasElement>("#raw2d-canvas");

if (!canvas) {
  throw new Error("Canvas element not found.");
}

const scene = new Scene();
const camera = new Camera2D();
const renderer = new CanvasRenderer({ canvas, width: 320, height: 180 });
const material = new BasicMaterial({ fillColor: "#35c2ff", strokeColor: "#ffffff", lineWidth: 2 });
const rect = new Rect({ x: 48, y: 42, width: 120, height: 72, material });
const label = new Text2D({
  x: 52,
  y: 132,
  text: "Raw2D",
  material: new BasicMaterial({ fillColor: "#ffffff" })
});

scene.add(rect).add(label);
renderer.render(scene, camera);
console.log(scene.getObjects().length);
`;
}

async function run(command, args, cwd) {
  const child = spawn(command, args, {
    cwd,
    env: { ...process.env, npm_config_fund: "false", npm_config_audit: "false" },
    shell: process.platform === "win32",
    stdio: "inherit"
  });
  const code = await new Promise((resolve) => child.on("close", resolve));

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
  const code = await new Promise((resolve) => child.on("close", resolve));

  if (code !== 0) {
    throw new Error(`Command failed: ${command} ${args.join(" ")}`);
  }

  return output;
}

console.log(`Umbrella install smoke passed for raw2d@${version}`);

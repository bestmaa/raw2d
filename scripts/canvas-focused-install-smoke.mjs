import { mkdir, mkdtemp, readFile, rm, writeFile } from "node:fs/promises";
import { tmpdir } from "node:os";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { spawn } from "node:child_process";

const root = fileURLToPath(new URL("../", import.meta.url));
const packageJson = JSON.parse(await readFile(new URL("../package.json", import.meta.url), "utf8"));
const version = packageJson.version;
const workspace = await mkdtemp(path.join(tmpdir(), `raw2d-canvas-focused-${version}-`));

try {
  await createProject(workspace);
  const tarballs = await packPackages(workspace);
  await run("npm", ["init", "-y"], workspace);
  await run("npm", ["install", ...tarballs, "vite@^8.0.10", "typescript@~6.0.2"], workspace);
  await run("npx", ["tsc", "--noEmit"], workspace);
  await run("npx", ["vite", "build"], workspace);
  await run("node", ["runtime-check.mjs"], workspace);
} finally {
  await rm(workspace, { recursive: true, force: true });
}

async function packPackages(destination) {
  const directories = ["packages/core", "packages/text", "packages/sprite", "packages/canvas"];
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
  <head><meta charset="UTF-8" /><title>Raw2D Canvas Focused Smoke</title></head>
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
  await writeFile(path.join(directory, "runtime-check.mjs"), `const core = await import("raw2d-core");
const canvas = await import("raw2d-canvas");

if (typeof core.Scene !== "function" || typeof canvas.CanvasRenderer !== "function") {
  throw new Error("Canvas focused exports are missing");
}

console.log("canvas-focused-runtime-ok", typeof core.Rect, typeof canvas.CanvasRenderer);
`);
  await writeFile(path.join(directory, "src/main.ts"), getMainSource());
}

function getMainSource() {
  return `import { BasicMaterial, Camera2D, Rect, Scene } from "raw2d-core";
import { CanvasRenderer } from "raw2d-canvas";

const canvas = document.querySelector<HTMLCanvasElement>("#raw2d-canvas");

if (!canvas) {
  throw new Error("Canvas element not found.");
}

const scene = new Scene();
const camera = new Camera2D();
const renderer = new CanvasRenderer({ canvas, width: 320, height: 180 });
const rect = new Rect({ x: 28, y: 28, width: 128, height: 72, material: new BasicMaterial({ fillColor: "#35c2ff" }) });

scene.add(rect);
renderer.render(scene, camera);
console.log(scene.getObjects().length, renderer.getStats().objects);
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

console.log(`Canvas focused install smoke passed for raw2d-core/raw2d-canvas@${version}`);

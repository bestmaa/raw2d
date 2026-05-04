import { mkdir, mkdtemp, readFile, rm, writeFile } from "node:fs/promises";
import { tmpdir } from "node:os";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { spawn } from "node:child_process";

const root = fileURLToPath(new URL("../", import.meta.url));
const packageJson = JSON.parse(await readFile(new URL("../package.json", import.meta.url), "utf8"));
const version = packageJson.version;
const workspace = await mkdtemp(path.join(tmpdir(), `raw2d-webgl-focused-${version}-`));

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
  const directories = ["packages/core", "packages/text", "packages/sprite", "packages/webgl"];
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
  <head><meta charset="UTF-8" /><title>Raw2D WebGL Focused Smoke</title></head>
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
const webgl = await import("raw2d-webgl");

if (typeof core.Scene !== "function" || typeof webgl.WebGLRenderer2D !== "function") {
  throw new Error("WebGL focused exports are missing");
}

console.log("webgl-focused-runtime-ok", typeof webgl.isWebGL2Available, typeof webgl.WebGLRenderer2D);
`);
  await writeFile(path.join(directory, "src/main.ts"), getMainSource());
}

function getMainSource() {
  return `import { BasicMaterial, Camera2D, Rect, Scene } from "raw2d-core";
import { WebGLRenderer2D, isWebGL2Available } from "raw2d-webgl";

const canvas = document.querySelector<HTMLCanvasElement>("#raw2d-canvas");

if (!canvas) {
  throw new Error("Canvas element not found.");
}

const scene = new Scene();
const camera = new Camera2D();
const rect = new Rect({ x: 28, y: 28, width: 128, height: 72, material: new BasicMaterial({ fillColor: "#35c2ff" }) });
const renderer = new WebGLRenderer2D({ canvas, width: 320, height: 180 });

scene.add(rect);

if (isWebGL2Available({ canvas })) {
  renderer.render(scene, camera);
}

console.log(scene.getObjects().length, typeof renderer.getStats().drawCalls);
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

console.log(`WebGL focused install smoke passed for raw2d-core/raw2d-webgl@${version}`);

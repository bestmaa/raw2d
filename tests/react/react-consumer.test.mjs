import assert from "node:assert/strict";
import { mkdir, mkdtemp, writeFile } from "node:fs/promises";
import { tmpdir } from "node:os";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { spawn } from "node:child_process";
import test from "node:test";

const root = fileURLToPath(new URL("../../", import.meta.url));

test("raw2d-react builds in a consumer Vite app", async () => {
  const workspace = await mkdtemp(path.join(tmpdir(), "raw2d-react-consumer-"));
  await writeConsumerFiles(workspace);

  await runCommand("npm", ["install", "--ignore-scripts"], workspace);
  await runCommand("npm", ["run", "build"], workspace);

  assert.ok(true);
});

async function writeConsumerFiles(workspace) {
  await mkdir(path.join(workspace, "src"), { recursive: true });
  await writeFile(path.join(workspace, "package.json"), JSON.stringify(createPackageJson(), null, 2));
  await writeFile(path.join(workspace, "tsconfig.json"), JSON.stringify(createTsConfig(), null, 2));
  await writeFile(path.join(workspace, "index.html"), `<div id="root"></div><script type="module" src="/src/main.ts"></script>`);
  await writeFile(path.join(workspace, "src", "main.ts"), `import { createElement } from "react";
import { createRoot } from "react-dom/client";
import { Texture } from "raw2d";
import { Raw2DCanvas, RawCircle, RawRect, RawSprite, RawText2D } from "raw2d-react";

const canvas = document.createElement("canvas");
canvas.width = 16;
canvas.height = 16;
const texture = new Texture({ source: canvas, width: 16, height: 16 });
const root = document.querySelector("#root");

if (!root) {
  throw new Error("Root not found.");
}

createRoot(root).render(createElement(Raw2DCanvas, { renderer: "canvas", width: 320, height: 240 }, [
  createElement(RawRect, { fillColor: "#35c2ff", height: 64, key: "rect", width: 96, x: 24, y: 32 }),
  createElement(RawCircle, { fillColor: "#f45b69", key: "circle", radius: 28, x: 180, y: 64 }),
  createElement(RawSprite, { key: "sprite", texture, x: 240, y: 42 }),
  createElement(RawText2D, { fillColor: "#f5f7fb", key: "text", text: "React", x: 24, y: 160 })
]));
`);
}

function createPackageJson() {
  return {
    name: "raw2d-react-consumer",
    version: "0.0.0",
    type: "module",
    private: true,
    scripts: { build: "tsc --noEmit && vite build" },
    dependencies: {
      "@types/react": "^19.2.7",
      "@types/react-dom": "^19.2.3",
      react: "^19.2.1",
      "react-dom": "^19.2.1",
      raw2d: `file:${path.join(root, "packages/raw2d")}`,
      "raw2d-react": `file:${path.join(root, "packages/react")}`,
      typescript: "~6.0.2",
      vite: "^8.0.10"
    },
    devDependencies: {}
  };
}

function createTsConfig() {
  return {
    compilerOptions: {
      target: "es2023",
      module: "esnext",
      lib: ["ES2023", "DOM"],
      moduleResolution: "bundler",
      strict: true,
      jsx: "react-jsx",
      noEmit: true,
      skipLibCheck: true
    },
    include: ["src"]
  };
}

async function runCommand(command, args, cwd) {
  const child = spawn(command, args, { cwd, stdio: ["ignore", "pipe", "pipe"] });
  let output = "";

  child.stdout.on("data", (chunk) => {
    output += chunk.toString();
  });
  child.stderr.on("data", (chunk) => {
    output += chunk.toString();
  });

  const code = await new Promise((resolve) => {
    child.on("close", resolve);
  });

  assert.equal(code, 0, output);
}

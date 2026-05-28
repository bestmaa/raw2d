import assert from "node:assert/strict";
import { spawn } from "node:child_process";
import { once } from "node:events";
import { mkdtemp, readFile, rm, writeFile } from "node:fs/promises";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { fileURLToPath, pathToFileURL } from "node:url";
import test from "node:test";
import ts from "typescript";

const studioRoot = fileURLToPath(new URL("../../apps/studio/", import.meta.url));
const viteBin = fileURLToPath(new URL("../../node_modules/vite/bin/vite.js", import.meta.url));
const port = 8600 + Math.floor(Math.random() * 400);
const baseUrl = `http://127.0.0.1:${port}`;

test("Studio resize handles keep visual pixels stable after crossing all corners", async (t) => {
  const server = startStudioServer();
  const resize = await importResizeModule(t);

  t.after(async () => stopServer(server.process));
  await waitForServer(server);

  const source = await fetchText("/studio/src/StudioResize.ts");
  assert.match(source, /drawStudioResizeHandles/);
  assert.match(source, /resizeStudioBounds/);

  for (const scenario of createCornerScenarios()) {
    const scene = createScene();
    const start = resize.startStudioResize(scene, "rect-1", scenario.start);

    assert.ok(start, scenario.handleId);

    const nextScene = resize.resizeStudioObject({ scene, session: start.session, pointer: scenario.pointer });
    assert.deepEqual(getRectBounds(nextScene), scenario.expectedBounds, scenario.handleId);
    assertHandlePixels(resize, nextScene, scenario.expectedHandles);
  }
});

async function importResizeModule(t) {
  const directory = await mkdtemp(join(tmpdir(), "raw2d-studio-browser-resize-visual-"));

  t.after(async () => rm(directory, { recursive: true, force: true }));
  await writeModule(directory, "StudioBoxResize");
  await writeModule(directory, "StudioLineResize");
  await writeModule(directory, "StudioTextResize");
  await writeModule(directory, "StudioSceneGraph");
  await writeModule(directory, "StudioObjectBounds", {
    "./StudioLineResize": "./StudioLineResize.js",
    "./StudioTextResize": "./StudioTextResize.js"
  });
  await writeModule(directory, "StudioResize", {
    "./StudioBoxResize": "./StudioBoxResize.js",
    "./StudioLineResize": "./StudioLineResize.js",
    "./StudioObjectBounds": "./StudioObjectBounds.js",
    "./StudioSceneGraph": "./StudioSceneGraph.js",
    "./StudioTextResize": "./StudioTextResize.js"
  });

  return import(pathToFileURL(join(directory, "StudioResize.js")).href);
}

async function writeModule(directory, name, replacements = {}) {
  let output = transpile(await readFile(`apps/studio/src/${name}.ts`, "utf8"));

  for (const [from, to] of Object.entries(replacements)) {
    output = output.replaceAll(`from "${from}";`, `from "${to}";`);
  }

  await writeFile(join(directory, `${name}.js`), output);
}

function createCornerScenarios() {
  return [
    createScenario("top-left", { x: 100, y: 100 }, { x: 200, y: 180 }, { x: 180, y: 160, width: 20, height: 20 }),
    createScenario("top-right", { x: 180, y: 100 }, { x: 80, y: 180 }, { x: 80, y: 160, width: 20, height: 20 }),
    createScenario("bottom-left", { x: 100, y: 160 }, { x: 200, y: 80 }, { x: 180, y: 80, width: 20, height: 20 }),
    createScenario("bottom-right", { x: 180, y: 160 }, { x: 80, y: 80 }, { x: 80, y: 80, width: 20, height: 20 })
  ];
}

function createScenario(handleId, start, pointer, expectedBounds) {
  return {
    handleId,
    start,
    pointer,
    expectedBounds,
    expectedHandles: [
      { x: expectedBounds.x, y: expectedBounds.y },
      { x: expectedBounds.x + expectedBounds.width, y: expectedBounds.y },
      { x: expectedBounds.x, y: expectedBounds.y + expectedBounds.height },
      { x: expectedBounds.x + expectedBounds.width, y: expectedBounds.y + expectedBounds.height }
    ]
  };
}

function assertHandlePixels(resize, scene, expectedHandles) {
  const context = createPixelContext();

  resize.drawStudioResizeHandles(context, scene, "rect-1");

  for (const handle of expectedHandles) {
    assert.equal(context.hasPixel(handle.x, handle.y), true, `${handle.x},${handle.y}`);
  }
}

function createPixelContext() {
  const pixels = new Set();

  return {
    save() {},
    restore() {},
    scale() {},
    translate() {},
    strokeRect() {},
    set fillStyle(value) { this.currentFillStyle = value; },
    set strokeStyle(value) { this.currentStrokeStyle = value; },
    set lineWidth(value) { this.currentLineWidth = value; },
    fillRect(x, y, width, height) {
      for (let pixelX = Math.floor(x); pixelX < x + width; pixelX += 1) {
        for (let pixelY = Math.floor(y); pixelY < y + height; pixelY += 1) {
          pixels.add(`${pixelX},${pixelY}`);
        }
      }
    },
    hasPixel(x, y) {
      return pixels.has(`${Math.round(x)},${Math.round(y)}`);
    }
  };
}

function getRectBounds(scene) {
  const object = scene.objects[0];
  return { x: object.x, y: object.y, width: object.width, height: object.height };
}

function createScene() {
  return {
    version: 1,
    name: "Resize Visual Test",
    rendererMode: "canvas",
    camera: { x: 0, y: 0, zoom: 1 },
    assets: [],
    objects: [{ id: "rect-1", type: "rect", name: "Rect 1", x: 100, y: 100, width: 80, height: 60 }]
  };
}

function transpile(source) {
  return ts.transpileModule(source, {
    compilerOptions: { module: ts.ModuleKind.ESNext, target: ts.ScriptTarget.ES2022 }
  }).outputText;
}

function startStudioServer() {
  const viteProcess = spawn(process.execPath, [viteBin, "--host", "127.0.0.1", "--port", String(port), "--strictPort"], {
    cwd: studioRoot,
    env: { ...process.env, BROWSER: "none" },
    stdio: ["ignore", "pipe", "pipe"]
  });
  let logs = "";

  viteProcess.stdout.on("data", (chunk) => { logs += chunk.toString(); });
  viteProcess.stderr.on("data", (chunk) => { logs += chunk.toString(); });
  return { process: viteProcess, getLogs: () => logs };
}

async function waitForServer(server) {
  for (let attempt = 0; attempt < 80; attempt += 1) {
    if (server.process.exitCode !== null) throw new Error(`Studio Vite exited before resize visual smoke started.\n${server.getLogs()}`);

    try {
      await fetchText("/studio/");
      return;
    } catch {
      await delay(100);
    }
  }

  throw new Error(`Studio Vite did not become ready.\n${server.getLogs()}`);
}

async function fetchText(route) {
  const response = await fetch(`${baseUrl}${route}`, {
    headers: { accept: route.endsWith(".ts") ? "text/javascript" : "text/html" }
  });
  const body = await response.text();

  assert.equal(response.status, 200, route);
  assert.doesNotMatch(body, /Internal server error|Failed to resolve import/i, route);
  return body;
}

async function stopServer(viteProcess) {
  if (viteProcess.exitCode !== null || viteProcess.signalCode !== null) return;
  viteProcess.kill("SIGTERM");
  await Promise.race([once(viteProcess, "exit"), delay(2_000)]);
}

function delay(ms) {
  return new Promise((resolve) => { setTimeout(resolve, ms); });
}

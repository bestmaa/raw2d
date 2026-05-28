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
const port = 7800 + Math.floor(Math.random() * 400);
const baseUrl = `http://127.0.0.1:${port}`;

test("Studio Line endpoint resize handles load and edit through browser smoke", async (t) => {
  const server = startStudioServer();
  const resize = await importResizeModule(t);

  t.after(async () => {
    await stopServer(server.process);
  });

  await waitForServer(server);

  const source = await fetchText("/studio/src/StudioResize.ts");
  assert.match(source, /resizeStudioLineEndpoint/);
  const lineSource = await fetchText("/studio/src/StudioLineResize.ts");
  assert.match(lineSource, /line-start/);
  assert.match(lineSource, /line-end/);

  const scene = createScene();
  const resizeStart = resize.startStudioResize(scene, "line-1", { x: 360, y: 300 });

  assert.ok(resizeStart);

  const nextScene = resize.resizeStudioObject({
    scene,
    session: resizeStart.session,
    pointer: { x: 330, y: 280 }
  });

  assert.equal(nextScene.objects[0].endX, 210);
  assert.equal(nextScene.objects[0].endY, -20);
});

async function importResizeModule(t) {
  const directory = await mkdtemp(join(tmpdir(), "raw2d-studio-browser-line-resize-"));

  t.after(async () => {
    await rm(directory, { recursive: true, force: true });
  });

  const boxResizePath = join(directory, "StudioBoxResize.js");
  const lineResizePath = join(directory, "StudioLineResize.js");
  const textResizePath = join(directory, "StudioTextResize.js");
  const boundsPath = join(directory, "StudioObjectBounds.js");
  const graphPath = join(directory, "StudioSceneGraph.js");
  const path = join(directory, "StudioResize.js");

  await writeFile(boxResizePath, transpile(await readFile("apps/studio/src/StudioBoxResize.ts", "utf8")));
  await writeFile(lineResizePath, transpile(await readFile("apps/studio/src/StudioLineResize.ts", "utf8")));
  await writeFile(textResizePath, transpile(await readFile("apps/studio/src/StudioTextResize.ts", "utf8")));
  await writeFile(graphPath, transpile(await readFile("apps/studio/src/StudioSceneGraph.ts", "utf8")));
  await writeFile(boundsPath, transpile(await readFile("apps/studio/src/StudioObjectBounds.ts", "utf8"))
    .replaceAll('from "./StudioLineResize";', 'from "./StudioLineResize.js";')
    .replaceAll('from "./StudioTextResize";', 'from "./StudioTextResize.js";'));
  await writeFile(path, transpile(await readFile("apps/studio/src/StudioResize.ts", "utf8"))
    .replaceAll('from "./StudioBoxResize";', 'from "./StudioBoxResize.js";')
    .replaceAll('from "./StudioLineResize";', 'from "./StudioLineResize.js";')
    .replaceAll('from "./StudioObjectBounds";', 'from "./StudioObjectBounds.js";')
    .replaceAll('from "./StudioSceneGraph";', 'from "./StudioSceneGraph.js";')
    .replaceAll('from "./StudioTextResize";', 'from "./StudioTextResize.js";'));
  return import(pathToFileURL(path).href);
}

function transpile(source) {
  return ts.transpileModule(source, {
    compilerOptions: { module: ts.ModuleKind.ESNext, target: ts.ScriptTarget.ES2022 }
  }).outputText;
}

function createScene() {
  return {
    version: 1,
    name: "Line Resize Test",
    rendererMode: "canvas",
    camera: { x: 0, y: 0, zoom: 1 },
    assets: [],
    objects: [{ id: "line-1", type: "line", name: "Line 1", x: 120, y: 300, startX: 0, startY: 0, endX: 240, endY: 0 }]
  };
}

function startStudioServer() {
  const viteProcess = spawn(process.execPath, [viteBin, "--host", "127.0.0.1", "--port", String(port), "--strictPort"], {
    cwd: studioRoot,
    env: { ...process.env, BROWSER: "none" },
    stdio: ["ignore", "pipe", "pipe"]
  });
  let logs = "";

  viteProcess.stdout.on("data", (chunk) => {
    logs += chunk.toString();
  });
  viteProcess.stderr.on("data", (chunk) => {
    logs += chunk.toString();
  });

  return { process: viteProcess, getLogs: () => logs };
}

async function waitForServer(server) {
  for (let attempt = 0; attempt < 80; attempt += 1) {
    if (server.process.exitCode !== null) {
      throw new Error(`Studio Vite exited before line resize smoke started.\n${server.getLogs()}`);
    }

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
  if (viteProcess.exitCode !== null || viteProcess.signalCode !== null) {
    return;
  }

  viteProcess.kill("SIGTERM");
  await Promise.race([once(viteProcess, "exit"), delay(2_000)]);
}

function delay(ms) {
  return new Promise((resolve) => {
    setTimeout(resolve, ms);
  });
}

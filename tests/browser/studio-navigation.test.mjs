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
const port = 8200 + Math.floor(Math.random() * 400);
const baseUrl = `http://127.0.0.1:${port}`;

test("Studio navigation helpers load fit zoom and minimap workflows", async (t) => {
  const server = startStudioServer();
  t.after(async () => stopServer(server.process));
  await waitForServer(server);

  const layout = await fetchText("/studio/src/StudioLayout.ts");
  assert.match(layout, /"zoom-selection"/);
  assert.match(layout, /"fit-scene"/);
  assert.match(layout, /data-minimap/);

  const appActions = await fetchText("/studio/src/StudioAppActions.ts");
  assert.match(appActions, /onNavigate/);
  assert.match(appActions, /isNavigationAction/);

  const navigation = await fetchText("/studio/src/StudioNavigation.ts");
  assert.match(navigation, /zoomStudioCameraToSelection/);
  assert.match(navigation, /fitStudioCameraToScene/);
  assert.match(navigation, /createStudioMinimapModel/);

  const module = await importNavigationModule(t);
  const scene = createScene();
  const fit = module.fitStudioCameraToScene(scene);
  assert.ok(fit);
  assert.equal(fit.camera.zoom < 1, true);
});

async function importNavigationModule(t) {
  const directory = await mkdtemp(join(tmpdir(), "raw2d-studio-browser-navigation-"));
  t.after(async () => rm(directory, { recursive: true, force: true }));
  await writeModule("apps/studio/src/StudioLineResize.ts", directory);
  await writeModule("apps/studio/src/StudioTextResize.ts", directory);
  await writeModule("apps/studio/src/StudioSceneGraph.ts", directory);
  await writeModule("apps/studio/src/StudioObjectBounds.ts", directory, {
    "./StudioLineResize": "./StudioLineResize.js",
    "./StudioTextResize": "./StudioTextResize.js"
  });
  await writeModule("apps/studio/src/StudioSelection.ts", directory, {
    "./StudioObjectBounds": "./StudioObjectBounds.js",
    "./StudioSceneGraph": "./StudioSceneGraph.js"
  });
  await writeModule("apps/studio/src/StudioNavigation.ts", directory, {
    "./StudioObjectBounds": "./StudioObjectBounds.js",
    "./StudioSceneGraph": "./StudioSceneGraph.js",
    "./StudioSelection": "./StudioSelection.js"
  });
  return import(pathToFileURL(join(directory, "StudioNavigation.js")).href);
}

async function writeModule(sourcePath, directory, replacements = {}) {
  let output = ts.transpileModule(await readFile(sourcePath, "utf8"), {
    compilerOptions: { module: ts.ModuleKind.ESNext, target: ts.ScriptTarget.ES2022 }
  }).outputText;
  for (const [from, to] of Object.entries(replacements)) output = output.replaceAll(`from "${from}";`, `from "${to}";`);
  await writeFile(join(directory, sourcePath.split("/").at(-1).replace(".ts", ".js")), output);
}

function createScene() {
  return {
    version: 1,
    name: "Browser Navigation Test",
    rendererMode: "canvas",
    camera: { x: 0, y: 0, zoom: 1 },
    assets: [],
    objects: [
      { id: "rect-1", type: "rect", name: "Rect 1", x: 100, y: 80, width: 80, height: 40 },
      { id: "rect-2", type: "rect", name: "Rect 2", x: 1200, y: 900, width: 160, height: 120 }
    ]
  };
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
    if (server.process.exitCode !== null) throw new Error(`Studio Vite exited before navigation smoke started.\n${server.getLogs()}`);
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
  const response = await fetch(`${baseUrl}${route}`, { headers: { accept: route.endsWith(".ts") ? "text/javascript" : "text/html" } });
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

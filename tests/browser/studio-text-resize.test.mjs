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

test("Studio Text2D resize scales font through browser smoke", async (t) => {
  const server = startStudioServer();
  const resize = await importResizeModule(t);

  t.after(async () => stopServer(server.process));
  await waitForServer(server);

  const resizeSource = await fetchText("/studio/src/StudioResize.ts");
  assert.match(resizeSource, /resizeStudioTextObject/);
  const textSource = await fetchText("/studio/src/StudioTextResize.ts");
  assert.match(textSource, /setFontSize/);
  assert.match(textSource, /getStudioTextResizeBounds/);

  const scene = createScene();
  const resizeStart = resize.startStudioResize(scene, "text-1", { x: 152, y: 186 });

  assert.ok(resizeStart);

  const nextScene = resize.resizeStudioObject({
    scene,
    session: resizeStart.session,
    pointer: { x: 188, y: 201 }
  });

  assert.equal(nextScene.objects[0].y, 192);
  assert.equal(nextScene.objects[0].font, "36px sans-serif");
});

async function importResizeModule(t) {
  const directory = await mkdtemp(join(tmpdir(), "raw2d-studio-browser-text-resize-"));

  t.after(async () => rm(directory, { recursive: true, force: true }));
  await writeModule("StudioBoxResize");
  await writeModule("StudioLineResize");
  await writeModule("StudioTextResize");
  await writeModule("StudioSceneGraph");
  await writeModule("StudioObjectBounds", {
    "./StudioLineResize": "./StudioLineResize.js",
    "./StudioTextResize": "./StudioTextResize.js"
  });
  await writeModule("StudioResize", {
    "./StudioBoxResize": "./StudioBoxResize.js",
    "./StudioLineResize": "./StudioLineResize.js",
    "./StudioObjectBounds": "./StudioObjectBounds.js",
    "./StudioSceneGraph": "./StudioSceneGraph.js",
    "./StudioTextResize": "./StudioTextResize.js"
  });

  return import(pathToFileURL(join(directory, "StudioResize.js")).href);

  async function writeModule(name, replacements = {}) {
    let output = transpile(await readFile(`apps/studio/src/${name}.ts`, "utf8"));

    for (const [from, to] of Object.entries(replacements)) {
      output = output.replaceAll(`from "${from}";`, `from "${to}";`);
    }

    await writeFile(join(directory, `${name}.js`), output);
  }
}

function transpile(source) {
  return ts.transpileModule(source, {
    compilerOptions: { module: ts.ModuleKind.ESNext, target: ts.ScriptTarget.ES2022 }
  }).outputText;
}

function createScene() {
  return {
    version: 1,
    name: "Text Resize Test",
    rendererMode: "canvas",
    camera: { x: 0, y: 0, zoom: 1 },
    assets: [],
    objects: [{ id: "text-1", type: "text2d", name: "Text 1", x: 80, y: 180, text: "Raw2D", font: "24px sans-serif" }]
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
      throw new Error(`Studio Vite exited before text resize smoke started.\n${server.getLogs()}`);
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

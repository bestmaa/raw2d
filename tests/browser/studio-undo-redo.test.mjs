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
const port = 7400 + Math.floor(Math.random() * 500);
const baseUrl = `http://127.0.0.1:${port}`;

test("Studio undo redo smoke covers create move resize and Circle radius edits", async (t) => {
  const server = startStudioServer();
  const modules = await importWorkflowModules(t);

  t.after(async () => stopServer(server.process));

  await waitForServer(server);
  await assertStudioEditingRoute();
  assertUndoRedoWorkflow(modules);
  assertCircleResizeWorkflow(modules);
});

async function importWorkflowModules(t) {
  const directory = await mkdtemp(join(tmpdir(), "raw2d-studio-browser-history-"));

  t.after(async () => rm(directory, { recursive: true, force: true }));

  await writeTranspiledModule("apps/studio/src/StudioCommand.ts", join(directory, "StudioCommand.js"));
  await writeTranspiledModule("apps/studio/src/StudioHistory.ts", join(directory, "StudioHistory.js"), {
    "./StudioCommand": "./StudioCommand.js"
  });
  await writeTranspiledModule("apps/studio/src/StudioCommandFactory.ts", join(directory, "StudioCommandFactory.js"));
  await writeTranspiledModule("apps/studio/src/StudioObjectFactory.ts", join(directory, "StudioObjectFactory.js"));
  await writeTranspiledModule("apps/studio/src/StudioLineResize.ts", join(directory, "StudioLineResize.js"));
  await writeTranspiledModule("apps/studio/src/StudioResize.ts", join(directory, "StudioResize.js"), {
    "./StudioLineResize": "./StudioLineResize.js"
  });

  return {
    history: await import(pathToFileURL(join(directory, "StudioHistory.js")).href),
    commands: await import(pathToFileURL(join(directory, "StudioCommandFactory.js")).href),
    objects: await import(pathToFileURL(join(directory, "StudioObjectFactory.js")).href),
    resize: await import(pathToFileURL(join(directory, "StudioResize.js")).href)
  };
}

async function writeTranspiledModule(sourcePath, outputPath, replacements = {}) {
  const source = await readFile(sourcePath, "utf8");
  let output = ts.transpileModule(source, {
    compilerOptions: {
      module: ts.ModuleKind.ESNext,
      target: ts.ScriptTarget.ES2022
    }
  }).outputText;

  for (const [from, to] of Object.entries(replacements)) {
    output = output.replaceAll(`from "${from}";`, `from "${to}";`);
  }

  await writeFile(outputPath, output);
}

async function assertStudioEditingRoute() {
  const html = await fetchText("/studio/");
  assert.match(html, /studio-root/);

  const layout = await fetchText("/studio/src/StudioLayout.ts");
  assert.match(layout, /data-action="undo"/);
  assert.match(layout, /data-action="redo"/);

  const app = await fetchText("/studio/src/StudioApp.ts");
  assert.match(app, /applyStudioHistoryCommand/);
  assert.match(app, /undoStudioHistory/);
  assert.match(app, /redoStudioHistory/);

  const resize = await fetchText("/studio/src/StudioResize.ts");
  assert.match(resize, /resizeCircleObject/);
  assert.match(resize, /resizeSquareBounds/);
  assert.match(resize, /radius/);
}

function assertUndoRedoWorkflow(modules) {
  let scene = createEmptyScene();
  let history = modules.history.createStudioHistory();
  const createdScene = modules.objects.addStudioRectObject({ scene });
  const createdObject = createdScene.objects[0];

  ({ scene, history } = applyEdit(modules, scene, history, modules.commands.createStudioCreateObjectCommand(createdObject, 0)));
  assert.equal(scene.objects.length, 1);

  const movedObject = { ...createdObject, x: createdObject.x + 40, y: createdObject.y + 24 };
  ({ scene, history } = applyEdit(modules, scene, history, modules.commands.createStudioTransformCommand(createdObject, movedObject)));
  assert.equal(findObject(scene, createdObject.id).x, movedObject.x);

  const resizedObject = { ...movedObject, width: movedObject.width + 32, height: movedObject.height + 20 };
  ({ scene, history } = applyEdit(modules, scene, history, modules.commands.createStudioTransformCommand(movedObject, resizedObject)));
  assert.equal(findObject(scene, createdObject.id).width, resizedObject.width);

  const materialObject = { ...resizedObject, material: { ...resizedObject.material, fillColor: "#ff0000" } };
  ({ scene, history } = applyEdit(modules, scene, history, modules.commands.createStudioMaterialCommand(resizedObject, materialObject)));
  assert.equal(findObject(scene, createdObject.id).material.fillColor, "#ff0000");

  ({ scene, history } = undoEdit(modules, scene, history));
  assert.equal(findObject(scene, createdObject.id).material.fillColor, "#35c2ff");
  ({ scene, history } = undoEdit(modules, scene, history));
  assert.equal(findObject(scene, createdObject.id).width, movedObject.width);
  ({ scene, history } = undoEdit(modules, scene, history));
  assert.equal(findObject(scene, createdObject.id).x, createdObject.x);
  ({ scene, history } = undoEdit(modules, scene, history));
  assert.equal(scene.objects.length, 0);

  ({ scene, history } = redoEdit(modules, scene, history));
  assert.equal(scene.objects.length, 1);
  ({ scene, history } = redoEdit(modules, scene, history));
  assert.equal(findObject(scene, createdObject.id).x, movedObject.x);
  ({ scene, history } = redoEdit(modules, scene, history));
  assert.equal(findObject(scene, createdObject.id).width, resizedObject.width);
  ({ scene, history } = redoEdit(modules, scene, history));
  assert.equal(findObject(scene, createdObject.id).material.fillColor, "#ff0000");
}

function assertCircleResizeWorkflow(modules) {
  const scene = { ...createEmptyScene(), objects: [{ id: "circle-1", type: "circle", name: "Circle 1", x: 60, y: 60, radius: 30 }] };
  const resizeStart = modules.resize.startStudioResize(scene, "circle-1", { x: 90, y: 90 });

  assert.ok(resizeStart);

  const nextScene = modules.resize.resizeStudioObject({
    scene,
    session: resizeStart.session,
    pointer: { x: 120, y: 110 }
  });

  assert.equal(nextScene.objects[0].x, 75);
  assert.equal(nextScene.objects[0].y, 75);
  assert.equal(nextScene.objects[0].radius, 45);
}

function applyEdit(modules, scene, history, command) {
  assert.ok(command);
  const result = modules.history.applyStudioHistoryCommand({ scene, history, command });

  assert.equal(result.handled, true);
  return result;
}

function undoEdit(modules, scene, history) {
  const result = modules.history.undoStudioHistory({ scene, history });

  assert.equal(result.handled, true);
  return result;
}

function redoEdit(modules, scene, history) {
  const result = modules.history.redoStudioHistory({ scene, history });

  assert.equal(result.handled, true);
  return result;
}

function findObject(scene, objectId) {
  const object = scene.objects.find((candidate) => candidate.id === objectId);

  assert.ok(object);
  return object;
}

function createEmptyScene() {
  return {
    version: 1,
    name: "Browser Undo Redo Test",
    rendererMode: "canvas",
    camera: { x: 0, y: 0, zoom: 1 },
    assets: [],
    objects: []
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

  return {
    process: viteProcess,
    getLogs: () => logs
  };
}

async function waitForServer(server) {
  for (let attempt = 0; attempt < 80; attempt += 1) {
    if (server.process.exitCode !== null) {
      throw new Error(`Studio Vite exited before undo redo smoke started.\n${server.getLogs()}`);
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

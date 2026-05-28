import assert from "node:assert/strict";
import { spawn } from "node:child_process";
import { once } from "node:events";
import { fileURLToPath } from "node:url";
import test from "node:test";
import { importVisualPixelPage, runVisualPixelPage } from "./visual-pixel-runtime-utils.mjs";

const root = fileURLToPath(new URL("../../", import.meta.url));
const viteBin = fileURLToPath(new URL("../../node_modules/vite/bin/vite.js", import.meta.url));
const port = 9000 + Math.floor(Math.random() * 400);
const baseUrl = `http://127.0.0.1:${port}`;

test("visual pixel page covers WebGL parity signals", async (t) => {
  const server = startViteServer();
  const pageModule = await importVisualPixelPage(t, root);

  t.after(async () => {
    await stopServer(server.process);
  });

  await waitForServer(server);

  const html = await fetchText("/visual-test");
  assert.match(html, /Raw2D/);

  const source = [
    await fetchText("/src/pages/VisualPixelTest.ts"),
    await fetchText("/src/pages/VisualPixelCoverage.ts"),
    await fetchText("/src/pages/VisualPixelMatrix.ts")
  ].join("\n");
  for (const expected of [
    "new Sprite",
    "new Text2D",
    "new ShapePath",
    "getRendererSupportMatrix",
    "Renderer Parity Matrix",
    "setRenderMode(\"static\")",
    "culling: true",
    "staticCacheHits",
    "shapePathFillFallback: \"rasterize\"",
    "__raw2dPixelResult"
  ]) {
    assert.match(source, new RegExp(escapeRegExp(expected)), expected);
  }

  const result = runVisualPixelPage(pageModule);
  assert.equal(result.canvas.status, "passed");
  assert.equal(result.webgl.status, "passed");
  assert.equal(result.canvas.coverage.culled, 1);
  assert.equal(result.webgl.coverage.culled, 1);
  assert.equal(result.webgl.coverage.sprites, 1);
  assert.equal(result.webgl.coverage.shapePaths, 1);
  assert.equal(result.webgl.coverage.textTextures, 1);
  assert.equal(result.webgl.coverage.staticBatches > 0, true);
  assert.equal(result.webgl.coverage.staticCacheHits > 0, true);
  assert.equal(result.webgl.coloredPixels > 0, true);
  assert.equal(result.matrix.length, 11);

  const expectedKinds = ["Arc", "Circle", "Ellipse", "Group2D", "Line", "Polygon", "Polyline", "Rect", "ShapePath", "Sprite", "Text2D"];
  assert.deepEqual(
    result.matrix.map((row) => row.kind).sort(),
    expectedKinds
  );

  for (const row of result.matrix) {
    assert.equal(row.canvas.status, "passed", row.kind);
    assert.equal(row.webgl.status, "passed", row.kind);
    assert.equal(row.canvas.coloredPixels > 0, true, row.kind);
    assert.equal(row.webgl.coloredPixels > 0, true, row.kind);
  }
});

function startViteServer() {
  const viteProcess = spawn(process.execPath, [viteBin, "--host", "127.0.0.1", "--port", String(port), "--strictPort"], {
    cwd: root,
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
      throw new Error(`Vite exited before visual pixel test started.\n${server.getLogs()}`);
    }

    try {
      await fetchText("/");
      return;
    } catch {
      await delay(100);
    }
  }

  throw new Error(`Vite did not become ready.\n${server.getLogs()}`);
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

function escapeRegExp(value) {
  return value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

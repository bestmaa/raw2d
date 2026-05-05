import assert from "node:assert/strict";
import { spawn } from "node:child_process";
import { once } from "node:events";
import { fileURLToPath } from "node:url";
import test from "node:test";

const studioRoot = fileURLToPath(new URL("../../apps/studio/", import.meta.url));
const viteBin = fileURLToPath(new URL("../../node_modules/vite/bin/vite.js", import.meta.url));
const port = 6300 + Math.floor(Math.random() * 600);
const baseUrl = `http://127.0.0.1:${port}`;

test("Studio shell serves visual editor controls and runtime wiring", async (t) => {
  const server = startStudioServer();

  t.after(async () => {
    await stopServer(server.process);
  });

  await waitForServer(server);

  const html = await fetchText("/studio/");
  assert.match(html, /studio-root/);
  assert.doesNotMatch(html, /Internal server error|Failed to resolve import/i);

  const main = await fetchText("/studio/src/main.ts");
  assert.match(main, /StudioApp/);
  assert.match(main, /mount/);

  const layout = await fetchText("/studio/src/StudioLayout.ts");
  assert.match(layout, /studio-canvas/);
  assert.match(layout, /data-action="sample-scene"/);
  assert.match(layout, /data-renderer="\$\{option\.mode\}"/);
  assert.match(layout, /studio-stats/);
  assert.match(layout, /data-stats-renderer/);

  const renderer = await fetchText("/studio/src/StudioRenderer.ts");
  assert.match(renderer, /mode: "canvas"/);
  assert.match(renderer, /mode: "webgl"/);

  const state = await fetchText("/studio/src/StudioSceneState.ts");
  assert.match(state, /createStudioSampleSceneState/);
  assert.match(state, /sample-rect/);
  assert.match(state, /sample-circle/);
  assert.match(state, /sample-text/);

  const adapter = await fetchText("/studio/src/StudioRenderAdapter.ts");
  assert.match(adapter, /createRuntimeSceneFromStudioState/);
  assert.match(adapter, /new Rect/);
  assert.match(adapter, /new Circle/);
  assert.match(adapter, /new Text2D/);
});

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
      throw new Error(`Studio Vite exited before smoke test started.\n${server.getLogs()}`);
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

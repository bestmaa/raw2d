import assert from "node:assert/strict";
import { spawn } from "node:child_process";
import { once } from "node:events";
import { fileURLToPath } from "node:url";
import test from "node:test";

const root = fileURLToPath(new URL("../../", import.meta.url));
const viteBin = fileURLToPath(new URL("../../node_modules/vite/bin/vite.js", import.meta.url));
const port = 6200 + Math.floor(Math.random() * 700);
const baseUrl = `http://127.0.0.1:${port}`;

test("showcase page serves visual demo controls and modules", async (t) => {
  const server = startViteServer();

  t.after(async () => {
    await stopServer(server.process);
  });

  await waitForServer(server);

  const html = await fetchText("/examples/showcase/");
  for (const expected of [
    "raw2d-canvas",
    "raw2d-overlay",
    "raw2d-minimap",
    "raw2d-renderer",
    "raw2d-toggle-atlas",
    "raw2d-toggle-static",
    "raw2d-toggle-culling",
    "raw2d-copy-report"
  ]) {
    assert.match(html, new RegExp(expected), expected);
  }

  const main = await fetchText("/examples/showcase/main.ts");
  assert.match(main, /createShowcaseRenderer/);
  assert.match(main, /applyShowcasePerformance/);
  assert.match(main, /copyButton\.addEventListener\("click"/);

  const stats = await fetchText("/examples/showcase/showcaseStats.ts");
  const interaction = await fetchText("/examples/showcase/showcaseInteraction.ts");
  const performance = await fetchText("/examples/showcase/showcasePerformance.ts");

  assert.match(stats, /buildShowcaseStatsReport/);
  assert.match(stats, /textureBinds/);
  assert.match(interaction, /InteractionController/);
  assert.match(interaction, /enableResize/);
  assert.match(performance, /staticBatches/);
  assert.match(performance, /setRenderMode/);
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

  return {
    process: viteProcess,
    getLogs: () => logs
  };
}

async function waitForServer(server) {
  for (let attempt = 0; attempt < 80; attempt += 1) {
    if (server.process.exitCode !== null) {
      throw new Error(`Vite exited before showcase test started.\n${server.getLogs()}`);
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

import assert from "node:assert/strict";
import { spawn } from "node:child_process";
import { once } from "node:events";
import { fileURLToPath } from "node:url";
import test from "node:test";

const studioRoot = fileURLToPath(new URL("../../apps/studio/", import.meta.url));
const viteBin = fileURLToPath(new URL("../../node_modules/vite/bin/vite.js", import.meta.url));
const port = 8400 + Math.floor(Math.random() * 400);
const baseUrl = `http://127.0.0.1:${port}`;

test("Studio clipboard format and paste wiring load through browser smoke", async (t) => {
  const server = startStudioServer();
  t.after(async () => stopServer(server.process));
  await waitForServer(server);

  const layout = await fetchText("/studio/src/StudioLayout.ts");
  assert.match(layout, /data-action="copy-selection"/);
  assert.match(layout, /data-action="paste-selection"/);

  const actions = await fetchText("/studio/src/StudioAppActions.ts");
  assert.match(actions, /onCopySelection/);
  assert.match(actions, /onPasteSelection/);

  const app = await fetchText("/studio/src/StudioApp.ts");
  assert.match(app, /serializeStudioClipboard/);
  assert.match(app, /createStudioPasteCommand/);
  assert.match(app, /navigator\.clipboard/);

  const clipboard = await fetchText("/studio/src/StudioClipboard.ts");
  assert.match(clipboard, /raw2d-studio-clipboard/);
  assert.match(clipboard, /pasteStudioClipboard/);
  assert.match(clipboard, /createPasteId/);
});

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
    if (server.process.exitCode !== null) throw new Error(`Studio Vite exited before clipboard smoke started.\n${server.getLogs()}`);
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

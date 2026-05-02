import assert from "node:assert/strict";
import { spawn } from "node:child_process";
import { once } from "node:events";
import { fileURLToPath } from "node:url";
import test from "node:test";

const root = fileURLToPath(new URL("../../", import.meta.url));
const viteBin = fileURLToPath(new URL("../../node_modules/vite/bin/vite.js", import.meta.url));
const port = 5194;
const baseUrl = `http://127.0.0.1:${port}`;

test("docs and browser examples load through Vite", async (t) => {
  const server = startViteServer();

  t.after(async () => {
    await stopServer(server.process);
  });

  await waitForServer(server);

  for (const route of getHtmlRoutes()) {
    const response = await fetchRoute(route);
    const body = await response.text();

    assert.equal(response.status, 200, route);
    assert.match(response.headers.get("content-type") ?? "", /text\/html/, route);
    assert.doesNotMatch(body, /Internal server error|Failed to resolve import/i, route);
  }

  for (const route of getModuleRoutes()) {
    const response = await fetchRoute(route);
    const body = await response.text();

    assert.equal(response.status, 200, route);
    assert.match(response.headers.get("content-type") ?? "", /javascript|ecmascript/, route);
    assert.doesNotMatch(body, /Internal server error|Failed to resolve import/i, route);
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

  return {
    process: viteProcess,
    getLogs: () => logs
  };
}

async function stopServer(viteProcess) {
  if (viteProcess.exitCode !== null || viteProcess.signalCode !== null) {
    return;
  }

  viteProcess.kill("SIGTERM");
  await Promise.race([once(viteProcess, "exit"), delay(2_000)]);
}

async function waitForServer(server) {
  for (let attempt = 0; attempt < 80; attempt += 1) {
    if (server.process.exitCode !== null) {
      throw new Error(`Vite exited before smoke test started.\n${server.getLogs()}`);
    }

    try {
      const response = await fetchRoute("/");

      if (response.status === 200) {
        return;
      }
    } catch {
      await delay(100);
    }
  }

  throw new Error(`Vite did not become ready.\n${server.getLogs()}`);
}

async function fetchRoute(route) {
  return fetch(`${baseUrl}${route}`, {
    headers: { accept: route.endsWith(".ts") ? "text/javascript" : "text/html" }
  });
}

function getHtmlRoutes() {
  return [
    "/",
    "/doc",
    "/readme",
    "/visual-test",
    "/examples/canvas-basic/",
    "/examples/webgl-basic/",
    "/examples/sprite-atlas/",
    "/examples/interaction-basic/",
    "/examples/text-basic/"
  ];
}

function getModuleRoutes() {
  return [
    "/src/main.ts",
    "/examples/canvas-basic/main.ts",
    "/examples/webgl-basic/main.ts",
    "/examples/sprite-atlas/main.ts",
    "/examples/interaction-basic/main.ts",
    "/examples/text-basic/main.ts"
  ];
}

function delay(ms) {
  return new Promise((resolve) => {
    setTimeout(resolve, ms);
  });
}

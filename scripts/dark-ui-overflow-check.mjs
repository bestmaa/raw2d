import { readFile } from "node:fs/promises";
import { spawn } from "node:child_process";
import { once } from "node:events";
import { fileURLToPath } from "node:url";

const root = fileURLToPath(new URL("../", import.meta.url));
const viteBin = fileURLToPath(new URL("../node_modules/vite/bin/vite.js", import.meta.url));
const port = 5197;
const baseUrl = `http://127.0.0.1:${port}`;
const routes = ["/doc", "/readme", "/benchmark", "/studio", "/examples/showcase/", "/examples/canvas-basic/"];
const server = startViteServer();

try {
  await waitForServer(server);

  for (const route of routes) {
    await checkRoute(route);
  }

  await checkCssContracts();
  console.log(`dark-overflow-ok ${routes.length} routes`);
} finally {
  await stopServer(server.process);
}

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

async function waitForServer(serverHandle) {
  for (let attempt = 0; attempt < 80; attempt += 1) {
    if (serverHandle.process.exitCode !== null) {
      throw new Error(`Vite exited before dark overflow check started.\n${serverHandle.getLogs()}`);
    }

    try {
      const response = await fetch(`${baseUrl}/doc`);

      if (response.status === 200) return;
    } catch {
      await delay(100);
    }
  }

  throw new Error(`Vite did not become ready.\n${serverHandle.getLogs()}`);
}

async function checkRoute(route) {
  const response = await fetch(`${baseUrl}${route}`);
  const body = await response.text();

  assert(response.status === 200, `${route} should return 200`);
  assert(/text\/html/.test(response.headers.get("content-type") ?? ""), `${route} should return HTML`);
  assert(!/Internal server error|Failed to resolve import/i.test(body), `${route} should not show Vite errors`);
}

async function checkCssContracts() {
  const style = await readFile(new URL("../src/style.css", import.meta.url), "utf8");
  const docs = await readFile(new URL("../src/docs.css", import.meta.url), "utf8");
  const examples = await readFile(new URL("../examples/shared/example.css", import.meta.url), "utf8");
  const studioBase = await readFile(new URL("../apps/studio/src/style.css", import.meta.url), "utf8");
  const studioResponsive = await readFile(new URL("../apps/studio/src/responsive.css", import.meta.url), "utf8");
  const studio = `${studioBase}\n${studioResponsive}`;
  const studioProperties = await readFile(new URL("../apps/studio/src/properties.css", import.meta.url), "utf8");
  const combined = `${style}\n${docs}\n${examples}\n${studio}\n${studioProperties}`;

  assert(/background:\s*#0b0f16|background:\s*#10141c/.test(combined), "dark surfaces should stay explicit");
  assert(/min-width:\s*0/.test(combined), "grid/flex children need min-width zero");
  assert(/box-sizing:\s*border-box/.test(combined), "tool surfaces should use border-box");
  assert(/overflow-x:\s*auto/.test(combined), "long code or panels need horizontal overflow protection");
  assert(/max-width:\s*100%/.test(combined), "canvas and media surfaces need max-width protection");
  assert(/overflow:\s*auto/.test(combined), "fixed panels need scrollable overflow");
  assert(/\.studio-panel\s*\{[\s\S]*?overflow:\s*auto/.test(studio), "Studio panels need scrollable overflow");
  assert(/\.studio-actions\s*\{[\s\S]*?flex-wrap:\s*wrap/.test(studio), "Studio actions should wrap");
}

async function stopServer(viteProcess) {
  if (viteProcess.exitCode !== null || viteProcess.signalCode !== null) return;
  viteProcess.kill("SIGTERM");
  await Promise.race([once(viteProcess, "exit"), delay(2_000)]);
}

function assert(condition, message) {
  if (!condition) throw new Error(message);
}

function delay(ms) {
  return new Promise((resolve) => {
    setTimeout(resolve, ms);
  });
}

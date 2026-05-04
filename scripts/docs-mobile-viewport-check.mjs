import { readFile } from "node:fs/promises";
import { spawn } from "node:child_process";
import { once } from "node:events";
import { fileURLToPath } from "node:url";

const root = fileURLToPath(new URL("../", import.meta.url));
const viteBin = fileURLToPath(new URL("../node_modules/vite/bin/vite.js", import.meta.url));
const port = 5196;
const baseUrl = `http://127.0.0.1:${port}`;

const server = startViteServer();

try {
  await waitForServer(server);
  await checkRoute("/doc");
  await checkRoute("/readme");
  await checkMobileCss();
  console.log(`docs-mobile-ok ${baseUrl}/doc ${baseUrl}/readme`);
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

  return {
    process: viteProcess,
    getLogs: () => logs
  };
}

async function waitForServer(serverHandle) {
  for (let attempt = 0; attempt < 80; attempt += 1) {
    if (serverHandle.process.exitCode !== null) {
      throw new Error(`Vite exited before mobile docs check started.\n${serverHandle.getLogs()}`);
    }

    try {
      const response = await fetch(`${baseUrl}/doc`);

      if (response.status === 200) {
        return;
      }
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
  assert(/text\/html/.test(response.headers.get("content-type") ?? ""), `${route} should return html`);
  assert(!/Internal server error|Failed to resolve import/i.test(body), `${route} should not contain Vite errors`);
}

async function checkMobileCss() {
  const style = await readFile(new URL("../src/style.css", import.meta.url), "utf8");
  const docs = await readFile(new URL("../src/docs.css", import.meta.url), "utf8");

  assert(/@media \(max-width: 760px\)/.test(style), "style.css needs mobile media query");
  assert(/\.doc-page\s*\{[\s\S]*?grid-template-columns:\s*1fr/.test(style), "doc page should become one column");
  assert(/\.readme-page\s*\{[\s\S]*?grid-template-columns:\s*1fr/.test(style), "readme page should become one column");
  assert(/\.doc-sidebar\s*\{[\s\S]*?position:\s*static/.test(style), "doc sidebar should stop sticking on mobile");
  assert(/\.doc-search\s*\{[\s\S]*?grid-template-columns:\s*minmax\(0,\s*1fr\)\s*auto/.test(style), "search input should shrink");
  assert(/pre\s*\{[\s\S]*?overflow-x:\s*auto/.test(style), "code blocks should scroll horizontally");
  assert(/@media \(max-width: 760px\)/.test(docs), "docs.css needs mobile media query");
  assert(/\.doc-topic-layout\s*\{[\s\S]*?grid-template-columns:\s*1fr/.test(docs), "live demo layout should become one column");
}

async function stopServer(viteProcess) {
  if (viteProcess.exitCode !== null || viteProcess.signalCode !== null) {
    return;
  }

  viteProcess.kill("SIGTERM");
  await Promise.race([once(viteProcess, "exit"), delay(2_000)]);
}

function assert(condition, message) {
  if (!condition) {
    throw new Error(message);
  }
}

function delay(ms) {
  return new Promise((resolve) => {
    setTimeout(resolve, ms);
  });
}

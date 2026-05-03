import assert from "node:assert/strict";
import { mkdtemp, readFile, rm, writeFile } from "node:fs/promises";
import { tmpdir } from "node:os";
import path from "node:path";
import { spawn } from "node:child_process";
import { once } from "node:events";
import { test } from "node:test";

const root = process.cwd();
const scriptPath = path.join(root, "plugins", "raw2d", "scripts", "create-raw2d-example.mjs");

test("Raw2D example command creates an example that loads through Vite", async (t) => {
  const app = await mkdtemp(path.join(tmpdir(), "raw2d-example-"));
  let server;

  t.after(async () => {
    if (server) {
      await stopServer(server);
      await delay(200);
    }

    await rm(app, { recursive: true, force: true });
  });

  await run("node", [scriptPath, "--out", app, "--renderer", "canvas", "--shape", "circle"], root);
  await writeProjectFiles(app);

  const main = await readFile(path.join(app, "main.ts"), "utf8");
  assert.match(main, /new Circle/);
  assert.doesNotMatch(main, /WebGLRenderer2D/);

  const tarballs = await packWorkspacePackages(app);
  await run("npm", ["install", ...tarballs], app);
  await run("npm", ["run", "build"], app);

  server = startVite(app);
  await waitForRoute("http://127.0.0.1:5198/");
  const moduleResponse = await fetch("http://127.0.0.1:5198/main.ts");
  const moduleBody = await moduleResponse.text();

  assert.equal(moduleResponse.status, 200);
  assert.doesNotMatch(moduleBody, /Failed to resolve import|Internal server error/i);
});

async function writeProjectFiles(app) {
  await writeFile(path.join(app, "package.json"), `{
  "name": "raw2d-generated-example",
  "private": true,
  "version": "0.0.0",
  "type": "module",
  "scripts": { "build": "tsc --noEmit && vite build" },
  "dependencies": {},
  "devDependencies": { "typescript": "~6.0.2", "vite": "^8.0.10" }
}
`);
  await writeFile(path.join(app, "tsconfig.json"), `{
  "compilerOptions": {
    "target": "ES2023",
    "module": "ESNext",
    "lib": ["ES2023", "DOM"],
    "moduleResolution": "bundler",
    "strict": true,
    "verbatimModuleSyntax": true,
    "noUnusedLocals": true,
    "noUnusedParameters": true,
    "skipLibCheck": true
  },
  "include": ["main.ts"]
}
`);
}

async function packWorkspacePackages(destination) {
  const packageDirectories = [
    "packages/core",
    "packages/interaction",
    "packages/text",
    "packages/sprite",
    "packages/canvas",
    "packages/webgl",
    "packages/effects",
    "packages/raw2d"
  ];
  const tarballs = [];

  for (const packageDirectory of packageDirectories) {
    const output = await runForOutput("npm", ["pack", "--silent", "--pack-destination", destination], path.join(root, packageDirectory));
    const fileName = output.trim().split(/\r?\n/).filter(Boolean).at(-1);

    if (!fileName) {
      throw new Error(`npm pack did not return a tarball for ${packageDirectory}`);
    }

    tarballs.push(path.join(destination, fileName));
  }

  return tarballs;
}

function startVite(cwd) {
  return spawn("npx", ["vite", "--host", "127.0.0.1", "--port", "5198", "--strictPort"], {
    cwd,
    env: { ...process.env, BROWSER: "none" },
    shell: process.platform === "win32",
    stdio: "ignore"
  });
}

async function waitForRoute(url) {
  for (let attempt = 0; attempt < 80; attempt += 1) {
    try {
      const response = await fetch(url);

      if (response.status === 200) {
        return;
      }
    } catch {
      await new Promise((resolve) => setTimeout(resolve, 100));
    }
  }

  throw new Error(`Vite route did not become ready: ${url}`);
}

async function stopServer(server) {
  if (server.exitCode !== null || server.signalCode !== null) {
    return;
  }

  server.kill("SIGTERM");
  const stopped = await Promise.race([once(server, "exit").then(() => true), delay(2_000).then(() => false)]);

  if (!stopped) {
    server.kill("SIGKILL");
    await Promise.race([once(server, "exit"), delay(1_000)]);
  }
}

async function run(command, args, cwd) {
  const code = await wait(spawn(command, args, {
    cwd,
    env: { ...process.env, npm_config_fund: "false", npm_config_audit: "false" },
    shell: process.platform === "win32",
    stdio: "inherit"
  }));

  if (code !== 0) {
    throw new Error(`Command failed: ${command} ${args.join(" ")}`);
  }
}

async function runForOutput(command, args, cwd) {
  const child = spawn(command, args, {
    cwd,
    env: { ...process.env, npm_config_fund: "false", npm_config_audit: "false" },
    shell: process.platform === "win32",
    stdio: ["ignore", "pipe", "inherit"]
  });
  let output = "";

  child.stdout.on("data", (chunk) => {
    output += chunk.toString();
  });

  const code = await wait(child);

  if (code !== 0) {
    throw new Error(`Command failed: ${command} ${args.join(" ")}`);
  }

  return output;
}

function wait(child) {
  return new Promise((resolve) => child.on("close", resolve));
}

function delay(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

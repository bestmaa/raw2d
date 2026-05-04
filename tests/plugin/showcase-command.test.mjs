import assert from "node:assert/strict";
import { spawn } from "node:child_process";
import { mkdtemp, readFile, rm, writeFile } from "node:fs/promises";
import { tmpdir } from "node:os";
import path from "node:path";
import { test } from "node:test";

const root = process.cwd();
const scriptPath = path.join(root, "plugins", "raw2d", "scripts", "create-raw2d-showcase.mjs");

test("Raw2D showcase command creates a buildable WebGL showcase scene", async (t) => {
  const app = await mkdtemp(path.join(tmpdir(), "raw2d-showcase-"));

  t.after(async () => {
    await rm(app, { recursive: true, force: true });
  });

  await run("node", [scriptPath, "--out", app, "--renderer", "webgl"], root);
  await writeProjectFiles(app);

  const main = await readFile(path.join(app, "main.ts"), "utf8");
  assert.match(main, /WebGLRenderer2D/);
  assert.match(main, /renderMode: index % 2 === 0 \? "static" : "dynamic"/);
  assert.match(main, /renderer.render\(scene, camera\)/);

  const tarballs = await packWorkspacePackages(app);
  await run("npm", ["install", ...tarballs], app);
  await run("npm", ["run", "build"], app);
});

async function writeProjectFiles(app) {
  await writeFile(path.join(app, "package.json"), `{
  "name": "raw2d-showcase-command-test",
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
  const directories = [
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

  for (const directory of directories) {
    const output = await runForOutput("npm", ["pack", "--silent", "--pack-destination", destination], path.join(root, directory));
    const fileName = output.trim().split(/\r?\n/).filter(Boolean).at(-1);

    if (!fileName) {
      throw new Error(`npm pack did not return a tarball for ${directory}`);
    }

    tarballs.push(path.join(destination, fileName));
  }

  return tarballs;
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

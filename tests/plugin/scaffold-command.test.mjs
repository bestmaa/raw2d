import assert from "node:assert/strict";
import { mkdtemp, readFile, rm } from "node:fs/promises";
import { tmpdir } from "node:os";
import path from "node:path";
import { spawn } from "node:child_process";
import { test } from "node:test";

const root = process.cwd();
const scriptPath = path.join(root, "plugins", "raw2d", "scripts", "scaffold-raw2d-app.mjs");

test("Raw2D app scaffold command creates a buildable Vite app", async () => {
  const workspace = await mkdtemp(path.join(tmpdir(), "raw2d-scaffold-"));

  try {
    const app = path.join(workspace, "app");
    await run("node", [scriptPath, "--out", app, "--name", "Raw2D Demo", "--renderer", "webgl"], root);

    const packageJson = JSON.parse(await readFile(path.join(app, "package.json"), "utf8"));
    const main = await readFile(path.join(app, "src", "main.ts"), "utf8");

    assert.equal(packageJson.name, "raw2d-demo");
    assert.equal(packageJson.scripts.build, "tsc --noEmit && vite build");
    assert.match(main, /new WebGLRenderer2D/);
    assert.match(main, /new Canvas/);

    const tarballs = await packWorkspacePackages(workspace);
    await run("npm", ["install", ...tarballs], app);
    await run("npm", ["run", "build"], app);
  } finally {
    await rm(workspace, { recursive: true, force: true });
  }
});

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
    const output = await runForOutput(
      "npm",
      ["pack", "--silent", "--pack-destination", destination],
      path.join(root, packageDirectory)
    );
    const fileName = output.trim().split(/\r?\n/).filter(Boolean).at(-1);

    if (!fileName) {
      throw new Error(`npm pack did not return a tarball for ${packageDirectory}`);
    }

    tarballs.push(path.join(destination, fileName));
  }

  return tarballs;
}

async function run(command, args, cwd) {
  const child = spawn(command, args, {
    cwd,
    env: { ...process.env, npm_config_fund: "false", npm_config_audit: "false" },
    shell: process.platform === "win32",
    stdio: "inherit"
  });
  const code = await new Promise((resolve) => child.on("close", resolve));

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

  const code = await new Promise((resolve) => child.on("close", resolve));

  if (code !== 0) {
    throw new Error(`Command failed: ${command} ${args.join(" ")}`);
  }

  return output;
}


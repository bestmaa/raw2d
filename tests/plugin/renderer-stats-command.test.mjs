import assert from "node:assert/strict";
import { spawn } from "node:child_process";
import path from "node:path";
import { test } from "node:test";

const root = process.cwd();
const scriptPath = path.join(root, "plugins", "raw2d", "scripts", "explain-renderer-stats.mjs");

test("renderer stats command explains sample stats", async () => {
  const output = await runForOutput("node", [scriptPath, "--sample", "--json"], root);
  const result = JSON.parse(output);

  assert.equal(result.ok, true);
  assert.equal(result.renderer, "WebGLRenderer2D");
  assert.ok(result.lines.some((line) => line.includes("drawCalls: 4")));
  assert.ok(result.notes.some((note) => note.includes("batched")));
  assert.ok(result.notes.some((note) => note.includes("texture")));
});

test("renderer stats command accepts inline JSON", async () => {
  const input = JSON.stringify({ renderer: "Canvas", objects: 24, drawCalls: 24, fps: 60 });
  const output = await runForOutput("node", [scriptPath, "--input", input], root);

  assert.match(output, /renderer: Canvas/);
  assert.match(output, /objects: 24/);
  assert.match(output, /drawCalls: 24/);
});

async function runForOutput(command, args, cwd) {
  const child = spawn(command, args, {
    cwd,
    env: { ...process.env },
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


import assert from "node:assert/strict";
import { spawn } from "node:child_process";
import path from "node:path";
import { test } from "node:test";

const root = process.cwd();
const scriptPath = path.join(root, "plugins", "raw2d", "scripts", "run-visual-pixel-tests.mjs");

test("Raw2D visual pixel command reports the visual test plan", async () => {
  const output = await runForOutput("node", [scriptPath, "--dry-run", "--json"], root);
  const result = JSON.parse(output);

  assert.equal(result.ok, true);
  assert.equal(result.type, "visual-pixel-test-plan");
  assert.deepEqual(result.args, ["--test", "tests/webgl/visual-regression.test.mjs"]);
  assert.match(result.command, /node/);
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


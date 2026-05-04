import assert from "node:assert/strict";
import { spawn } from "node:child_process";
import path from "node:path";
import { test } from "node:test";

const root = process.cwd();
const scriptPath = path.join(root, "plugins", "raw2d", "scripts", "run-fresh-install-audit.mjs");

test("Raw2D fresh install audit command reports its command plan", async () => {
  const output = await runForOutput("node", [scriptPath, "--dry-run", "--json"], root);
  const result = JSON.parse(output);

  assert.equal(result.ok, true);
  assert.equal(result.type, "fresh-install-audit-plan");
  assert.deepEqual(result.commands.map((command) => command.command), ["npm", "npm"]);
  assert.deepEqual(result.commands[0]?.args, ["run", "pack:check", "--", "--silent"]);
  assert.deepEqual(result.commands[1]?.args, ["run", "test:consumer"]);
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

import assert from "node:assert/strict";
import { spawn } from "node:child_process";
import path from "node:path";
import { test } from "node:test";

const root = process.cwd();
const scriptPath = path.join(root, "plugins", "raw2d", "scripts", "run-docs-qa.mjs");

test("Raw2D docs QA command reports clean docs status", async () => {
  const output = await runForOutput("node", [scriptPath, "--json"], root);
  const result = JSON.parse(output);

  assert.equal(result.ok, true);
  assert.equal(result.issues.length, 0);
  assert.ok(result.docsCount > 20);
  assert.equal(result.docsCount, result.hinglishDocsCount);
});

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


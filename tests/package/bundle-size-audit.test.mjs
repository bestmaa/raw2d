import assert from "node:assert/strict";
import { spawn } from "node:child_process";
import test from "node:test";

test("bundle size audit passes current thresholds", async () => {
  const result = await runBundleAudit();

  assert.equal(result.code, 0, result.output);
  assert.match(result.output, /Raw2D bundle audit/);
  assert.match(result.output, /sideEffects false: true/);
});

async function runBundleAudit() {
  const child = spawn(process.execPath, ["scripts/audit-bundle-size.mjs", "--check"], {
    cwd: process.cwd(),
    stdio: ["ignore", "pipe", "pipe"]
  });
  let output = "";

  child.stdout.on("data", (chunk) => {
    output += chunk.toString();
  });
  child.stderr.on("data", (chunk) => {
    output += chunk.toString();
  });

  const code = await new Promise((resolve) => {
    child.on("close", resolve);
  });

  return { code, output };
}

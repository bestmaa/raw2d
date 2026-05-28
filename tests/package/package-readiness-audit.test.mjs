import assert from "node:assert/strict";
import { spawn } from "node:child_process";
import { readFileSync } from "node:fs";
import test from "node:test";

const version = JSON.parse(readFileSync("package.json", "utf8")).version;

test("package readiness audit covers size tree-shaking CDN and fresh installs", async () => {
  const result = await runAudit();

  assert.equal(result.code, 0, result.output);
  assert.match(result.output, new RegExp(`Raw2D package readiness audit v${escapeRegExp(version)}`));
  assert.match(result.output, /raw2d-webgl/);
  assert.match(result.output, /fresh install scripts: 7/);
  assert.match(result.output, /cdn entry: \.\/dist\/raw2d\.js \/ \.\/dist\/raw2d\.umd\.cjs/);
  assert.match(result.output, /issues: 0/);
});

async function runAudit() {
  const child = spawn(process.execPath, ["scripts/audit-package-readiness.mjs", "--check"], {
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

function escapeRegExp(value) {
  return value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

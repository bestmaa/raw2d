import assert from "node:assert/strict";
import { spawn } from "node:child_process";
import test from "node:test";

test("Canvas docs snippets compile in a temporary app", async () => {
  let output = "";
  const child = spawn("node", ["scripts/docs-canvas-snippet-smoke.mjs"], {
    stdio: ["ignore", "pipe", "pipe"]
  });

  child.stdout.on("data", (chunk) => {
    output += chunk.toString();
  });
  child.stderr.on("data", (chunk) => {
    output += chunk.toString();
  });

  const code = await new Promise((resolve) => child.on("close", resolve));

  assert.equal(code, 0, output);
  assert.match(output, /Canvas docs snippet smoke passed/);
});

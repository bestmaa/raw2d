import assert from "node:assert/strict";
import { spawn } from "node:child_process";
import { readFileSync } from "node:fs";
import test from "node:test";

test("dark UI overflow check passes", async () => {
  let output = "";
  const child = spawn("node", ["scripts/dark-ui-overflow-check.mjs"], {
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
  assert.match(output, /dark-overflow-ok/);
});

test("dark UI overflow audit is documented and routed", () => {
  const packageJson = readFileSync("package.json", "utf8");
  const topics = readFileSync("src/pages/DocTopics.ts", "utf8");
  const english = readFileSync("docs/DarkUIOverflowAudit.md", "utf8");
  const hinglish = readFileSync("docs/hi/DarkUIOverflowAudit.md", "utf8");

  assert.match(packageJson, /test:browser:dark-overflow/);
  assert.match(topics, /darkOverflowTopics/);
  assert.match(english, /examples\/showcase/);
  assert.match(hinglish, /examples\/showcase/);
});

import assert from "node:assert/strict";
import { spawn } from "node:child_process";
import { readFileSync } from "node:fs";
import test from "node:test";

test("docs mobile viewport check passes", async () => {
  let output = "";
  const child = spawn("node", ["scripts/docs-mobile-viewport-check.mjs"], {
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
  assert.match(output, /docs-mobile-ok/);
});

test("docs mobile viewport checklist is documented", () => {
  const packageJson = readFileSync("package.json", "utf8");
  const topics = readFileSync("src/pages/DocTopics.ts", "utf8");
  const english = readFileSync("docs/DocsMobileViewport.md", "utf8");
  const hinglish = readFileSync("docs/hi/DocsMobileViewport.md", "utf8");

  assert.match(packageJson, /test:browser:mobile-docs/);
  assert.match(topics, /mobileViewportTopics/);
  assert.match(english, /390px/);
  assert.match(hinglish, /390px/);
});

import assert from "node:assert/strict";
import { spawn } from "node:child_process";
import { readFileSync } from "node:fs";
import test from "node:test";

test("product docs snippets compile in a temporary app", async () => {
  let output = "";
  const child = spawn("node", ["scripts/product-docs-snippet-smoke.mjs"], {
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
  assert.match(output, /Product docs snippet smoke passed/);
});

test("product docs snippet audit is documented and scripted", () => {
  const packageJson = readFileSync("package.json", "utf8");
  const english = readFileSync("docs/ProductDocsSnippetAudit.md", "utf8");
  const hinglish = readFileSync("docs/hi/ProductDocsSnippetAudit.md", "utf8");

  assert.match(packageJson, /test:snippets:product/);
  assert.match(english, /fresh temporary TypeScript app/);
  assert.match(hinglish, /temporary TypeScript app/);
});

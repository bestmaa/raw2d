import { readFileSync } from "node:fs";
import test from "node:test";
import assert from "node:assert/strict";

const topic = readFileSync("src/pages/DocDeployTopics.ts", "utf8");
const english = readFileSync("docs/DocsDeployChecklist.md", "utf8");
const hinglish = readFileSync("docs/hi/DocsDeployChecklist.md", "utf8");

test("docs deploy checklist covers Cloudflare commands and domains", () => {
  for (const content of [topic, english, hinglish]) {
    assert.match(content, /build:docs/);
    assert.match(content, /wrangler deploy/);
    assert.match(content, /raw2d\.com\/doc/);
    assert.match(content, /workers\.dev\/doc/);
  }
});

test("docs deploy checklist covers route and redirect failures", () => {
  for (const content of [topic, english, hinglish]) {
    assert.match(content, /redirect/i);
    assert.match(content, /assets/i);
    assert.match(content, /placeholder/i);
    assert.match(content, /route binding|binding/i);
  }
});

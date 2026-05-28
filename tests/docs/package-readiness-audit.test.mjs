import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import test from "node:test";

const topic = readFileSync("src/pages/DocPackageReadinessTopics.ts", "utf8");
const topics = readFileSync("src/pages/DocTopics.ts", "utf8");
const english = readFileSync("docs/PackageReadinessAudit.md", "utf8");
const hinglish = readFileSync("docs/hi/PackageReadinessAudit.md", "utf8");
const script = readFileSync("scripts/audit-package-readiness.mjs", "utf8");
const rootPackage = readFileSync("package.json", "utf8");

test("package readiness audit docs cover release gates", () => {
  for (const content of [topic, english, hinglish]) {
    assert.match(content, /audit:package/);
    assert.match(content, /sideEffects/);
    assert.match(content, /CDN|cdn/i);
    assert.match(content, /fresh install/i);
    assert.match(content, /issues: 0/);
  }
});

test("package readiness audit is registered and scripted", () => {
  assert.match(topics, /packageReadinessTopics/);
  assert.match(script, /pack.*--workspaces.*--dry-run/s);
  assert.match(rootPackage, /"audit:package"/);
});

import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import test from "node:test";

const topic = readFileSync("src/pages/DocBrowserBugBashTopics.ts", "utf8");
const topics = readFileSync("src/pages/DocTopics.ts", "utf8");
const english = readFileSync("docs/BetaBrowserBugBash.md", "utf8");
const hinglish = readFileSync("docs/hi/BetaBrowserBugBash.md", "utf8");
const report = readFileSync("docs/V1BugBashReport.md", "utf8");
const reportHi = readFileSync("docs/hi/V1BugBashReport.md", "utf8");
const smoke = readFileSync("tests/browser/smoke.test.mjs", "utf8");

test("browser bug bash checklist covers beta docs, examples, Studio, and CDN routes", () => {
  for (const content of [topic, english, hinglish]) {
    assert.match(content, /\/doc/);
    assert.match(content, /\/readme/);
    assert.match(content, /\/examples/);
    assert.match(content, /\/studio/);
    assert.match(content, /\/cdn-smoke/);
    assert.match(content, /search/i);
    assert.match(content, /Hinglish/i);
    assert.match(content, /CDN/i);
  }
});

test("browser bug bash checklist is registered and browser-smoked", () => {
  assert.match(topics, /browserBugBashTopics/);
  assert.match(topic, /browser-bug-bash/);
  assert.match(topic, /v1-bug-bash-report/);
  assert.match(smoke, /"\/doc"/);
  assert.match(smoke, /"\/readme"/);
  assert.match(smoke, /"\/examples\/"/);
  assert.match(smoke, /"\/studio"/);
  assert.match(smoke, /"\/cdn-smoke"/);
});

test("v1 bug bash report covers final release-candidate scope", () => {
  for (const content of [topic, report, reportHi]) {
    assert.match(content, /npm test/);
    assert.match(content, /test:browser/);
    assert.match(content, /audit:package/);
    assert.match(content, /test:consumer/);
    assert.match(content, /Canvas/);
    assert.match(content, /WebGL/);
    assert.match(content, /React/);
    assert.match(content, /MCP/);
    assert.match(content, /Studio/);
  }
});

test("v1 bug bash report records completed results", () => {
  for (const content of [report, reportHi]) {
    assert.match(content, /Status: .*passed/);
    assert.match(content, /682\/682/);
    assert.match(content, /13\/13/);
    assert.match(content, /issues 0/);
    assert.match(content, /Deferred:/);
    assert.doesNotMatch(content, /In progress/);
  }
});

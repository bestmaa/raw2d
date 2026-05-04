import { readFileSync } from "node:fs";
import assert from "node:assert/strict";
import test from "node:test";

const page = readFileSync("src/pages/CDNSmokePage.ts", "utf8");
const script = readFileSync("scripts/cdn-pinned-check.mjs", "utf8");
const english = readFileSync("docs/CDNBetaSmoke.md", "utf8");
const hinglish = readFileSync("docs/hi/CDNBetaSmoke.md", "utf8");
const main = readFileSync("src/main.ts", "utf8");
const smoke = readFileSync("tests/browser/smoke.test.mjs", "utf8");

test("CDN beta smoke documents pinned CDN URLs and route", () => {
  for (const content of [page, english, hinglish]) {
    assert.match(content, /cdn-smoke/);
    assert.match(content, /cdn\.jsdelivr\.net\/npm\/raw2d@1\.7\.5\/dist\/raw2d\.js/);
    assert.match(content, /raw2d\.umd\.cjs/);
  }
});

test("CDN pinned check supports dry and live modes", () => {
  assert.match(script, /cdn-pinned-ok/);
  assert.match(script, /--live/);
  assert.match(script, /method: "HEAD"/);
});

test("CDN smoke page is routed and covered by browser smoke", () => {
  assert.match(main, /\/cdn-smoke/);
  assert.match(smoke, /\/cdn-smoke/);
});

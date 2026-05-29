import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import test from "node:test";

const packageJson = JSON.parse(readFileSync("package.json", "utf8"));
const healthScript = readFileSync("scripts/release-health-check.mjs", "utf8");
const registrySmoke = readFileSync("scripts/post-release-registry-smoke.mjs", "utf8");

test("release health command wires post-release checks together", () => {
  assert.equal(packageJson.scripts["release:health"], "node scripts/release-health-check.mjs");
  assertBefore("release:postpublish", "test:consumer:registry");
  assertBefore("test:consumer:registry", "test:cdn:pinned");
  assert.match(healthScript, /process\.argv\.includes\("--dry"\)/);
  assert.match(healthScript, /"test:cdn:pinned", \.\.\.\(dry \? \[\] : \["--", "--live"\]\)/);
  assert.match(healthScript, /release-health-ok raw2d@\$\{version\}/);
});

test("release health live mode covers public product routes", () => {
  const routes = [
    "https://raw2d.com/",
    "https://raw2d.com/doc",
    "https://raw2d.com/readme",
    "https://raw2d.com/examples/",
    "https://raw2d.com/examples/canvas-basic/",
    "https://raw2d.com/studio",
    "https://raw2d.com/cdn-smoke",
    "https://raw2d.com/benchmark",
    "https://raw2d.com/visual-test"
  ];

  for (const route of routes) {
    assert.match(healthScript, new RegExp(escapeRegExp(route)));
  }
});

test("registry smoke follows the workspace release version", () => {
  assert.match(registrySmoke, /new URL\("\.\.\/package\.json", import\.meta\.url\)/);
  assert.doesNotMatch(registrySmoke, /const version = "\d+\.\d+\.\d+"/);
});

function assertBefore(left, right) {
  const leftIndex = healthScript.indexOf(left);
  const rightIndex = healthScript.indexOf(right);

  assert.ok(leftIndex >= 0, `${left} missing from release health script`);
  assert.ok(rightIndex >= 0, `${right} missing from release health script`);
  assert.ok(leftIndex < rightIndex, `${left} should appear before ${right}`);
}

function escapeRegExp(value) {
  return value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

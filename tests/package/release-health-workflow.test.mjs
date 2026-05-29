import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import test from "node:test";

const workflow = readFileSync(".github/workflows/release-health.yml", "utf8");

test("release health workflow runs on manual dispatch and schedule", () => {
  assert.match(workflow, /name: Release Health/);
  assert.match(workflow, /workflow_dispatch:/);
  assert.match(workflow, /schedule:/);
  assert.match(workflow, /cron: "41 4 \* \* 1"/);
});

test("release health workflow only runs public release health", () => {
  assert.match(workflow, /node-version: 22/);
  assert.match(workflow, /npm ci/);
  assert.match(workflow, /npm run release:health/);
  assert.doesNotMatch(workflow, /npm test/);
  assert.doesNotMatch(workflow, /npm publish/);
});

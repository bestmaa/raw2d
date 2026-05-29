import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import test from "node:test";

const workflow = readFileSync(".github/workflows/publish.yml", "utf8");

test("publish workflow runs release readiness gates before npm publish", () => {
  assertBefore("npm run release:preflight", "npm test");
  assertBefore("npm run pack:check -- --silent", "npm run audit:package");
  assertBefore("npm run audit:package", "npm run test:consumer");
  assertBefore("npm run test:consumer", "npm run test:cdn:pinned");
  assertBefore("npm run test:cdn:pinned", "npm publish --workspace raw2d-core --access public");
});

test("publish workflow verifies auth tag and post-publish state", () => {
  const script = readFileSync("scripts/release-publish-check.mjs", "utf8");

  assert.match(workflow, /NODE_AUTH_TOKEN: \$\{\{ secrets\.NPM_TOKEN \}\}/);
  assert.match(workflow, /npm run release:preflight/);
  assert.match(workflow, /npm run release:postpublish/);
  assert.match(workflow, /npm run test:cdn:pinned -- --live/);
  assert.match(script, /GITHUB_REF_TYPE/);
  assert.match(script, /npm", \["whoami"\]/);
  assert.match(script, /already published/);
  assert.match(script, /latest is/);
});

test("publish workflow publishes dependencies before dependent packages", () => {
  assertPackageBefore("raw2d-core", "raw2d-canvas");
  assertPackageBefore("raw2d-core", "raw2d-webgl");
  assertPackageBefore("raw2d-effects", "raw2d-canvas");
  assertPackageBefore("raw2d-effects", "raw2d-webgl");
  assertPackageBefore("raw2d-sprite", "raw2d");
  assertPackageBefore("raw2d-text", "raw2d");
  assertPackageBefore("raw2d-canvas", "raw2d");
  assertPackageBefore("raw2d-webgl", "raw2d");
  assertPackageBefore("raw2d", "raw2d-react");
  assertPackageBefore("raw2d", "raw2d-react-fiber");
});

function assertBefore(left, right) {
  const leftIndex = workflow.indexOf(left);
  const rightIndex = workflow.indexOf(right);

  assert.ok(leftIndex >= 0, `${left} missing from publish workflow`);
  assert.ok(rightIndex >= 0, `${right} missing from publish workflow`);
  assert.ok(leftIndex < rightIndex, `${left} should appear before ${right}`);
}

function assertPackageBefore(left, right) {
  assertBefore(`npm publish --workspace ${left} --access public`, `npm publish --workspace ${right} --access public`);
}

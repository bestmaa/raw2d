import assert from "node:assert/strict";
import test from "node:test";

import { createRaw2DVisualCheckPlan } from "../../packages/mcp/dist/index.js";

test("createRaw2DVisualCheckPlan returns the WebGL visual regression command", () => {
  const plan = createRaw2DVisualCheckPlan({ target: "webgl-geometry" });

  assert.equal(plan.target, "webgl-geometry");
  assert.equal(plan.manualBrowserRequired, false);
  assert.deepEqual(plan.commands, [
    {
      command: "node",
      args: ["--test", "tests/webgl/visual-regression.test.mjs"],
      description: "Verify stable WebGL geometry and sprite/text visual snapshots."
    }
  ]);
});

test("createRaw2DVisualCheckPlan returns browser smoke command", () => {
  const plan = createRaw2DVisualCheckPlan({ target: "browser-smoke" });

  assert.equal(plan.manualBrowserRequired, true);
  assert.equal(plan.commands[0]?.command, "npm");
  assert.deepEqual(plan.commands[0]?.args, ["run", "test:browser"]);
});

test("createRaw2DVisualCheckPlan defaults to all visual checks", () => {
  const plan = createRaw2DVisualCheckPlan();

  assert.equal(plan.target, "all");
  assert.equal(plan.commands.length, 2);
});

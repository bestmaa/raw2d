import assert from "node:assert/strict";
import { spawnSync } from "node:child_process";
import { test } from "node:test";

test("docs link audit passes", () => {
  const result = spawnSync("node", ["scripts/audit-doc-links.mjs"], {
    cwd: process.cwd(),
    encoding: "utf8"
  });

  assert.equal(result.status, 0, result.stderr);
  assert.match(result.stdout, /Docs link audit passed:/);
});

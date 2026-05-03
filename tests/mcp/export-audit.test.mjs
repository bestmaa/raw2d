import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";

import { auditRaw2DPackageExports } from "../../packages/mcp/dist/index.js";

test("auditRaw2DPackageExports accepts current package manifests", async () => {
  const result = auditRaw2DPackageExports({
    packages: [await readManifest("packages/core/package.json"), await readManifest("packages/raw2d/package.json")]
  });

  assert.equal(result.valid, true);
  assert.equal(result.checkedPackages, 2);
  assert.deepEqual(result.issues, []);
});

test("auditRaw2DPackageExports reports invalid focused package exports", () => {
  const result = auditRaw2DPackageExports({
    packages: [
      {
        name: "raw2d-core",
        types: "./wrong.d.ts",
        module: "./dist/index.js",
        main: "./dist/index.cjs",
        exports: { ".": { types: "./wrong.d.ts", import: "./dist/index.js", require: "./dist/index.cjs" } }
      }
    ]
  });

  assert.equal(result.valid, false);
  assert.deepEqual(
    result.issues.map((issue) => issue.path),
    ["types", "module", "exports['.'].require"]
  );
});

async function readManifest(path) {
  return JSON.parse(await readFile(path, "utf8"));
}

import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import { join } from "node:path";
import test from "node:test";

const packageNames = [
  "raw2d-canvas",
  "raw2d-core",
  "raw2d-effects",
  "raw2d-interaction",
  "raw2d-mcp",
  "raw2d",
  "raw2d-sprite",
  "raw2d-text",
  "raw2d-webgl"
];

test("all publishable packages expose one stable root export map", async () => {
  for (const packageName of packageNames) {
    const manifest = await readPackageManifest(packageName);
    const rootExport = manifest.exports["."];

    assert.equal(typeof rootExport, "object", packageName);
    assert.equal(rootExport.types, "./dist/index.d.ts", `${packageName} types`);
    assert.equal(manifest.types, "./dist/index.d.ts", `${packageName} top-level types`);
    assert.deepEqual(Object.keys(manifest.exports), ["."], `${packageName} exports`);
  }
});

test("focused packages use the TypeScript build output as their ESM export", async () => {
  for (const packageName of packageNames.filter((name) => name !== "raw2d")) {
    const manifest = await readPackageManifest(packageName);

    assert.equal(manifest.exports["."].import, "./dist/index.js", `${packageName} import`);
    assert.equal(manifest.module, "./dist/index.js", `${packageName} module`);
    assert.equal(manifest.main, "./dist/index.js", `${packageName} main`);
    assert.equal(manifest.exports["."].require, undefined, `${packageName} require`);
  }
});

test("umbrella package exports ESM and CommonJS CDN builds", async () => {
  const manifest = await readPackageManifest("raw2d");
  const rootExport = manifest.exports["."];

  assert.equal(rootExport.import, "./dist/raw2d.js");
  assert.equal(rootExport.require, "./dist/raw2d.umd.cjs");
  assert.equal(manifest.module, "./dist/raw2d.js");
  assert.equal(manifest.main, "./dist/raw2d.umd.cjs");
  assert.equal(manifest.unpkg, "./dist/raw2d.umd.cjs");
  assert.equal(manifest.jsdelivr, "./dist/raw2d.umd.cjs");
});

async function readPackageManifest(packageName) {
  const directory = packageName === "raw2d" ? "raw2d" : packageName.replace("raw2d-", "");
  const content = await readFile(join("packages", directory, "package.json"), "utf8");
  return JSON.parse(content);
}

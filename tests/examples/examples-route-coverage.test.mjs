import { readdirSync, readFileSync, statSync } from "node:fs";
import assert from "node:assert/strict";
import test from "node:test";

const exampleDirs = readdirSync("examples")
  .filter((name) => statSync(`examples/${name}`).isDirectory())
  .filter((name) => name !== "shared")
  .sort();
const indexHtml = readFileSync("examples/index.html", "utf8");
const readme = readFileSync("examples/README.md", "utf8");
const browserSmoke = readFileSync("tests/browser/smoke.test.mjs", "utf8");

test("all example folders are linked from the examples index", () => {
  for (const name of exampleDirs) {
    assert.match(indexHtml, new RegExp(`\\./${escapeRegExp(name)}/`), name);
  }
});

test("all example folders are covered by README and browser smoke routes", () => {
  for (const name of exampleDirs) {
    assert.match(readme, new RegExp(escapeRegExp(name)), name);
    assert.match(browserSmoke, new RegExp(`/examples/${escapeRegExp(name)}/`), name);
    assert.match(browserSmoke, new RegExp(`/examples/${escapeRegExp(name)}/main\\.ts`), name);
  }
});

function escapeRegExp(value) {
  return value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

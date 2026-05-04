import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import { fileURLToPath } from "node:url";
import test from "node:test";
import * as ReactBridge from "raw2d-react";

const root = fileURLToPath(new URL("../../", import.meta.url));
const components = ["Raw2DCanvas", "RawRect", "RawCircle", "RawLine", "RawSprite", "RawText2D"];

test("raw2d-react public bridge matches the React example component set", async () => {
  const example = await readFile(`${root}examples/react-basic/main.ts`, "utf8");

  for (const component of components) {
    assert.equal(typeof ReactBridge[component], "function", `${component} should be exported`);
    assert.match(example, new RegExp(`\\b${component}\\b`), `${component} should be used in react-basic`);
  }
});

test("React package docs cover the current bridge component set", async () => {
  const docs = await readFile(`${root}docs/Raw2DReactPackage.md`, "utf8");
  const plan = await readFile(`${root}docs/ReactAdapterVsFiber.md`, "utf8");

  for (const component of components) {
    assert.match(docs, new RegExp(`\\b${component}\\b`), `${component} should be documented`);
  }

  assert.match(plan, /raw2d-react-fiber/);
  assert.equal(ReactBridge.RAW2D_REACT_PACKAGE_INFO.packageName, "raw2d-react");
  assert.equal(ReactBridge.RAW2D_REACT_PACKAGE_INFO.changesCoreApi, false);
});

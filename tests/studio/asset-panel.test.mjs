import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import test from "node:test";
import ts from "typescript";

async function importAssetPanelModule() {
  const source = readFileSync("apps/studio/src/StudioAssetPanel.ts", "utf8");
  const output = ts.transpileModule(source, {
    compilerOptions: {
      module: ts.ModuleKind.ESNext,
      target: ts.ScriptTarget.ES2022
    }
  }).outputText;
  const url = `data:text/javascript;base64,${Buffer.from(output).toString("base64")}`;
  return import(url);
}

test("Studio asset panel renders import controls, selection, and preview", async () => {
  const module = await importAssetPanelModule();
  const model = module.createStudioAssetPanelModel(
    {
      version: 1,
      name: "Asset Panel",
      rendererMode: "canvas",
      camera: { x: 0, y: 0, zoom: 1 },
      assets: [{ id: "asset-1", type: "image", name: "Hero", width: 320, height: 180, src: "blob:hero", objectIds: [] }],
      objects: [{ id: "sprite-1", type: "sprite", name: "Sprite", x: 0, y: 0, width: 64, height: 64, assetSlot: "empty" }]
    },
    "asset-1",
    "sprite-1"
  );
  const html = module.renderStudioAssetPanel(model);

  assert.equal(model.items[0].selected, true);
  assert.equal(model.bindEnabled, true);
  assert.match(html, /data-asset-action="import"/);
  assert.match(html, /data-asset-action="bind"/);
  assert.match(html, /data-asset-action="remove"/);
  assert.match(html, /data-asset-import-input/);
  assert.match(html, /data-asset-action="select"/);
  assert.match(html, /data-asset-preview="asset-1"/);
  assert.match(html, /<img src="blob:hero"/);
});

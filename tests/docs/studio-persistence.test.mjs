import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import test from "node:test";

const englishFormat = readFileSync("docs/Raw2DStudioSceneFormat.md", "utf8");
const hinglishFormat = readFileSync("docs/hi/Raw2DStudioSceneFormat.md", "utf8");
const routeTopics = readFileSync("src/pages/DocStudioTopics.ts", "utf8");
const readmeDocs = readFileSync("src/pages/ReadmeDocs.ts", "utf8");
const hinglishReadmeDocs = readFileSync("src/pages/ReadmeHinglishDocs.ts", "utf8");

test("Studio persistence docs cover save load export", () => {
  for (const content of [englishFormat, hinglishFormat, routeTopics]) {
    assert.match(content, /Save/);
    assert.match(content, /Load/);
    assert.match(content, /Export/);
    assert.match(content, /raw2d\.json/);
    assert.match(content, /PNG/);
  }
});

test("Studio persistence docs show current scene schema", () => {
  for (const content of [englishFormat, hinglishFormat, routeTopics]) {
    assert.match(content, /rendererMode/);
    assert.match(content, /"assets": \[\]/);
    assert.match(content, /"objects": \[\]/);
    assert.doesNotMatch(content, /"scene": \{ "objects"/);
  }
});

test("Studio persistence docs cover asset metadata limits", () => {
  for (const content of [englishFormat, hinglishFormat, routeTopics]) {
    assert.match(content, /assetSlot/);
    assert.match(content, /asset-1/);
    assert.match(content, /mimeType/);
    assert.match(content, /blob URL|blob URLs|object URL/);
    assert.match(content, /missing asset/i);
  }
});

test("Studio persistence docs cover explicit validation messages", () => {
  for (const content of [englishFormat, hinglishFormat, routeTopics]) {
    assert.match(content, /unsupported object/i);
    assert.match(content, /invalid geometry/i);
    assert.match(content, /duplicate.*MCP IDs|Duplicate IDs|duplicate IDs/i);
    assert.match(content, /invalid.*MCP IDs|Invalid .* IDs|invalid IDs/i);
    assert.match(content, /Loaded scene with warnings|warnings|diagnostics/i);
  }
});

test("Studio persistence docs cover Canvas code export", () => {
  for (const content of [englishFormat, hinglishFormat, routeTopics]) {
    assert.match(content, /Copy Code/i);
    assert.match(content, /Canvas-only|Canvas/);
    assert.match(content, /raw2d/);
  }
});

test("Studio persistence docs cover WebGL code export warnings", () => {
  for (const content of [englishFormat, hinglishFormat, routeTopics]) {
    assert.match(content, /Copy WebGL/i);
    assert.match(content, /WebGLRenderer2D/);
    assert.match(content, /WebGL2|isWebGL2Available/);
    assert.match(content, /warnings|diagnostics/i);
  }
});

test("Studio persistence docs cover MCP import boundaries", () => {
  for (const content of [englishFormat, hinglishFormat, routeTopics]) {
    assert.match(content, /Raw2D MCP/);
    assert.match(content, /scene.*objects|objects.*scene/s);
    assert.match(content, /mcp-rect-1/);
    assert.match(content, /deterministic/i);
  }
});

test("Studio persistence docs cover generated-code boundaries", () => {
  for (const content of [englishFormat, hinglishFormat, routeTopics]) {
    assert.match(content, /Generated Code Boundary|Generated snippets|Generated code/i);
    assert.match(content, /public `?raw2d`?|public raw2d/i);
    assert.match(content, /StudioRenderAdapter/);
    assert.match(content, /apps\/studio/);
  }
});

test("Studio persistence docs are available from readme docs", () => {
  assert.match(readmeDocs, /Raw2DStudioSceneFormat/);
  assert.match(readmeDocs, /studio-scene-format/);
  assert.match(hinglishReadmeDocs, /Raw2DStudioSceneFormat/);
  assert.match(hinglishReadmeDocs, /studio-scene-format/);
});

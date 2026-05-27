import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import test from "node:test";

const englishDocs = readFileSync("docs/Raw2DStudioTools.md", "utf8");
const hinglishDocs = readFileSync("docs/hi/Raw2DStudioTools.md", "utf8");
const routeTopics = readFileSync("src/pages/DocStudioTopics.ts", "utf8");

test("Studio tools docs cover current MVP creation helpers", () => {
  for (const helper of [
    "addStudioRectObject",
    "addStudioCircleObject",
    "addStudioLineObject",
    "addStudioTextObject",
    "addStudioSpriteObject"
  ]) {
    assert.match(englishDocs, new RegExp(helper));
    assert.match(hinglishDocs, new RegExp(helper));
    assert.match(routeTopics, new RegExp(helper));
  }
});

test("Studio tools docs explain Sprite placeholder asset slot", () => {
  for (const content of [englishDocs, hinglishDocs, routeTopics]) {
    assert.match(content, /assetSlot/);
    assert.match(content, /asset-1/);
    assert.match(content, /update-sprite-asset|Use/);
  }
});

test("Studio tools docs keep small and full examples visible", () => {
  assert.match(englishDocs, /Small example/);
  assert.match(englishDocs, /Full scene object/);
  assert.match(hinglishDocs, /Chhota example/);
  assert.match(hinglishDocs, /Full scene object/);
});

test("Studio tools docs cover current command history names", () => {
  for (const content of [englishDocs, hinglishDocs]) {
    assert.match(content, /create-object/);
    assert.match(content, /delete-object/);
    assert.match(content, /update-transform/);
    assert.match(content, /update-material/);
    assert.match(content, /update-text/);
    assert.match(content, /set-visibility/);
    assert.match(content, /reorder-object/);
    assert.doesNotMatch(content, /produce command objects later/);
  }
});

test("Studio tools docs explain Text2D resize scale rules", () => {
  for (const content of [englishDocs, hinglishDocs, routeTopics]) {
    assert.match(content, /Text2D/);
    assert.match(content, /resize|Resize/);
    assert.match(content, /font size|font scale|font size scale/);
  }
});

test("Studio tools docs explain multi-select group movement", () => {
  for (const content of [englishDocs, hinglishDocs, routeTopics]) {
    assert.match(content, /shift-select|shift click/);
    assert.match(content, /group|multiple/);
    assert.match(content, /bounds/);
  }
});

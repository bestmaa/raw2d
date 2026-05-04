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
    assert.match(content, /empty/);
  }
});

test("Studio tools docs keep small and full examples visible", () => {
  assert.match(englishDocs, /Small example/);
  assert.match(englishDocs, /Full scene object/);
  assert.match(hinglishDocs, /Chhota example/);
  assert.match(hinglishDocs, /Full scene object/);
});

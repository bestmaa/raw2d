import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import test from "node:test";

const pager = readFileSync("src/pages/DocPager.ts", "utf8");
const topics = readFileSync("src/pages/DocTopics.ts", "utf8");

test("docs pager exposes beginner group progress and stable topic ids", () => {
  assert.match(pager, /getGroupProgress/);
  assert.match(pager, /group\.topics\.findIndex/);
  assert.match(pager, /button\.dataset\.topicId = topic\.id/);
  assert.match(pager, /step \$\{index \+ 1\}/);
});

test("beginner docs keep Start Here as the first navigation group", () => {
  assert.match(topics, /id: "start-here"/);
  assert.ok(topics.indexOf("id: \"start-here\"") < topics.indexOf("id: \"scene-foundations\""));
  assert.ok(topics.indexOf("...startHereTopics") < topics.indexOf("...setupTopics"));
});

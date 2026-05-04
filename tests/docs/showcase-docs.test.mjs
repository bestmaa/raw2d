import { readFileSync } from "node:fs";
import assert from "node:assert/strict";
import test from "node:test";

const topic = readFileSync("src/pages/DocShowcaseTopics.ts", "utf8");
const markdown = readFileSync("docs/ShowcaseDemo.md", "utf8");
const hiMarkdown = readFileSync("docs/hi/ShowcaseDemo.md", "utf8");

test("showcase docs explain what Raw2D proves", () => {
  for (const expected of ["What It Proves", "same `Scene` and `Camera2D`", "Canvas is the readable correctness path"]) {
    assert.match(markdown, new RegExp(expected.replaceAll("`", "\\`")));
  }

  assert.match(topic, /What It Proves/);
  assert.match(topic, /Use It For Decisions/);
});

test("showcase docs explain practical renderer decisions", () => {
  for (const expected of ["atlas sorting", "static batches", "culling", "/examples/showcase/"]) {
    assert.match(markdown, new RegExp(expected));
  }

  assert.match(hiMarkdown, /Ye Kya Prove Karta Hai/);
  assert.match(hiMarkdown, /Demo Kaise Padhein/);
  assert.match(hiMarkdown, /Live Route/);
});

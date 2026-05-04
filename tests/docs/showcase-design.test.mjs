import { readFileSync } from "node:fs";
import assert from "node:assert/strict";
import test from "node:test";

const topic = readFileSync("src/pages/DocShowcaseTopics.ts", "utf8");
const groups = readFileSync("src/pages/DocTopics.ts", "utf8");
const readme = readFileSync("src/pages/ReadmeDocs.ts", "utf8");
const hiReadme = readFileSync("src/pages/ReadmeHinglishDocs.ts", "utf8");
const markdown = readFileSync("docs/ShowcaseDemo.md", "utf8");
const hiMarkdown = readFileSync("docs/hi/ShowcaseDemo.md", "utf8");

test("showcase design is registered in docs and readme", () => {
  assert.match(topic, /id: "showcase-demo"/);
  assert.match(groups, /showcaseTopics/);
  assert.match(readme, /ShowcaseDemo\.md/);
  assert.match(hiReadme, /hi\/ShowcaseDemo\.md/);
});

test("showcase design defines scope and performance targets", () => {
  for (const expected of ["300+ sprites", "Canvas target", "WebGL target", "live renderer stats"]) {
    assert.match(markdown, new RegExp(expected.replace("+", "\\+")));
  }

  assert.match(hiMarkdown, /Canvas kab use karna hai/);
  assert.match(hiMarkdown, /WebGL kab use karna hai/);
});

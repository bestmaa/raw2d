import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import test from "node:test";

const releaseNotes = readFileSync("RELEASE_NOTES.md", "utf8");
const archive = readFileSync("docs/releases/ReleaseNotesArchive.md", "utf8");
const releaseFile = readFileSync("docs/releases/v1.20.5-effects-foundation-phase.md", "utf8");

test("effects foundation release notes cover the phase output", () => {
  for (const content of [releaseNotes, archive, releaseFile]) {
    assert.match(content, /v1\.20\.5 - Effects Foundation Phase/);
    assert.match(content, /raw2d-effects/);
    assert.match(content, /Canvas effect application/);
    assert.match(content, /WebGL effect pass planning/);
    assert.match(content, /effects-basic/);
    assert.match(content, /Verification/);
  }
});

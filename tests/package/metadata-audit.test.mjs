import assert from "node:assert/strict";
import { access, readFile } from "node:fs/promises";
import { join } from "node:path";
import test from "node:test";

const packageDirs = ["canvas", "core", "effects", "interaction", "mcp", "raw2d", "react", "sprite", "text", "webgl"];
const expectedFiles = ["README.md", "LICENSE", "NOTICE", "TRADEMARKS.md"];

test("package metadata includes source, docs, legal, and discovery fields", async () => {
  for (const dir of packageDirs) {
    const manifest = await readManifest(dir);

    assert.equal(manifest.author, "Aditya Nandlal", manifest.name);
    assert.equal(manifest.license, "Apache-2.0", manifest.name);
    assert.equal(manifest.repository?.url, "git+https://github.com/bestmaa/raw2d.git", manifest.name);
    assert.equal(manifest.bugs?.url, "https://github.com/bestmaa/raw2d/issues", manifest.name);
    assert.equal(manifest.homepage, "https://raw2d.com/doc", manifest.name);
    assert.ok(manifest.keywords.includes("raw2d"), manifest.name);
    assert.ok(manifest.keywords.length >= 4, manifest.name);
    assert.deepEqual(manifest.files, ["dist", "README.md", "LICENSE", "NOTICE", "TRADEMARKS.md"], manifest.name);
  }
});

test("package legal files are present and carry Raw2D attribution", async () => {
  for (const dir of packageDirs) {
    for (const file of expectedFiles) {
      await access(join("packages", dir, file));
    }

    const notice = await readFile(join("packages", dir, "NOTICE"), "utf8");
    const trademarks = await readFile(join("packages", dir, "TRADEMARKS.md"), "utf8");

    assert.match(notice, /Aditya Nandlal/, dir);
    assert.match(trademarks, /Raw2D Marks/, dir);
  }
});

async function readManifest(dir) {
  return JSON.parse(await readFile(join("packages", dir, "package.json"), "utf8"));
}


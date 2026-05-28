import { readFile } from "node:fs/promises";

const packageJson = JSON.parse(await readFile(new URL("../package.json", import.meta.url), "utf8"));
const version = packageJson.version;
const packageEntries = [
  ["raw2d", "dist/raw2d.js"],
  ["raw2d", "dist/raw2d.umd.cjs"],
  ["raw2d-canvas", "dist/index.js"],
  ["raw2d-core", "dist/index.js"],
  ["raw2d-effects", "dist/index.js"],
  ["raw2d-interaction", "dist/index.js"],
  ["raw2d-mcp", "dist/index.js"],
  ["raw2d-react", "dist/index.js"],
  ["raw2d-react-fiber", "dist/index.js"],
  ["raw2d-sprite", "dist/index.js"],
  ["raw2d-text", "dist/index.js"],
  ["raw2d-webgl", "dist/index.js"]
];
const urls = packageEntries.map(([name, file]) => `https://cdn.jsdelivr.net/npm/${name}@${version}/${file}`);
const live = process.argv.includes("--live");

for (const url of urls) {
  if (!/^https:\/\/cdn\.jsdelivr\.net\/npm\/raw2d(?:-[a-z0-9-]+)?@\d+\.\d+\.\d+\/dist\/(?:index\.js|raw2d\.js|raw2d\.umd\.cjs)$/.test(url)) {
    throw new Error(`Invalid pinned CDN URL: ${url}`);
  }
}

if (live) {
  for (const url of urls) {
    const response = await fetch(url, { method: "HEAD" });

    if (!response.ok) {
      throw new Error(`CDN URL failed: ${url} ${response.status}`);
    }
  }
}

console.log(`cdn-pinned-ok raw2d packages@${version}`);
for (const url of urls) {
  console.log(url);
}

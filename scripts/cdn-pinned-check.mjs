import { readFile } from "node:fs/promises";

const packageJson = JSON.parse(await readFile(new URL("../package.json", import.meta.url), "utf8"));
const version = packageJson.version;
const urls = [
  `https://cdn.jsdelivr.net/npm/raw2d@${version}/dist/raw2d.js`,
  `https://cdn.jsdelivr.net/npm/raw2d@${version}/dist/raw2d.umd.cjs`
];
const live = process.argv.includes("--live");

for (const url of urls) {
  if (!/^https:\/\/cdn\.jsdelivr\.net\/npm\/raw2d@\d+\.\d+\.\d+\/dist\/raw2d(\.umd\.cjs|\.js)$/.test(url)) {
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

console.log(`cdn-pinned-ok raw2d@${version}`);
for (const url of urls) {
  console.log(url);
}

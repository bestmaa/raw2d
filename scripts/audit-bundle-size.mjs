import { readFile } from "node:fs/promises";
import { gzipSync } from "node:zlib";

const packageNames = ["canvas", "core", "effects", "interaction", "mcp", "react", "sprite", "text", "webgl"];
const umbrellaLimits = {
  "packages/raw2d/dist/raw2d.js": { bytes: 160_000, gzipBytes: 40_000 },
  "packages/raw2d/dist/raw2d.umd.cjs": { bytes: 125_000, gzipBytes: 35_000 }
};
const focusedEntryLimit = 12_000;

const report = {
  umbrella: await measureFiles(Object.keys(umbrellaLimits)),
  focusedEntries: await measureFiles(packageNames.map((name) => `packages/${name}/dist/index.js`)),
  sideEffects: await readSideEffectsFlags()
};
const issues = [
  ...checkUmbrellaLimits(report.umbrella),
  ...checkFocusedEntryLimits(report.focusedEntries),
  ...checkSideEffects(report.sideEffects)
];

if (process.argv.includes("--json")) {
  console.log(JSON.stringify({ ...report, issues }, null, 2));
} else {
  printReport(report, issues);
}

if (process.argv.includes("--check") && issues.length > 0) {
  process.exitCode = 1;
}

async function measureFiles(paths) {
  return Promise.all(paths.map(async (path) => {
    const content = await readFile(path);
    return {
      path,
      bytes: content.byteLength,
      gzipBytes: gzipSync(content).byteLength
    };
  }));
}

async function readSideEffectsFlags() {
  const paths = ["packages/raw2d/package.json", ...packageNames.map((name) => `packages/${name}/package.json`)];

  return Promise.all(paths.map(async (path) => {
    const manifest = JSON.parse(await readFile(path, "utf8"));
    return {
      name: manifest.name,
      sideEffects: manifest.sideEffects
    };
  }));
}

function checkUmbrellaLimits(entries) {
  return entries.flatMap((entry) => {
    const limit = umbrellaLimits[entry.path];
    const issues = [];

    if (entry.bytes > limit.bytes) issues.push(`${entry.path} exceeds ${limit.bytes} bytes.`);
    if (entry.gzipBytes > limit.gzipBytes) issues.push(`${entry.path} exceeds ${limit.gzipBytes} gzip bytes.`);
    return issues;
  });
}

function checkFocusedEntryLimits(entries) {
  return entries
    .filter((entry) => entry.bytes > focusedEntryLimit)
    .map((entry) => `${entry.path} exceeds ${focusedEntryLimit} bytes.`);
}

function checkSideEffects(entries) {
  return entries
    .filter((entry) => entry.sideEffects !== false)
    .map((entry) => `${entry.name} must keep sideEffects false for tree-shaking.`);
}

function printReport(result, issues) {
  console.log("Raw2D bundle audit");
  printEntries("umbrella", result.umbrella);
  printEntries("focused entries", result.focusedEntries);
  console.log(`sideEffects false: ${result.sideEffects.every((entry) => entry.sideEffects === false)}`);

  if (issues.length > 0) {
    console.log("issues:");
    for (const issue of issues) console.log(`- ${issue}`);
  }
}

function printEntries(label, entries) {
  console.log(label);
  for (const entry of entries) {
    console.log(`- ${entry.path}: ${entry.bytes} bytes, ${entry.gzipBytes} gzip bytes`);
  }
}

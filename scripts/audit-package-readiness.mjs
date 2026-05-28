import { readFile, stat } from "node:fs/promises";
import path from "node:path";
import { spawn } from "node:child_process";
import { gzipSync } from "node:zlib";

const root = process.cwd();
const expectedPackages = [
  "raw2d-canvas",
  "raw2d-core",
  "raw2d-effects",
  "raw2d-interaction",
  "raw2d-mcp",
  "raw2d",
  "raw2d-react",
  "raw2d-react-fiber",
  "raw2d-sprite",
  "raw2d-text",
  "raw2d-webgl"
];
const packBudgets = {
  "raw2d": { size: 90_000, unpackedSize: 330_000 },
  "raw2d-core": { size: 42_000, unpackedSize: 180_000 },
  "raw2d-webgl": { size: 65_000, unpackedSize: 280_000 },
  "default": { size: 35_000, unpackedSize: 140_000 }
};
const entryBudgets = {
  "dist/raw2d.js": { bytes: 160_000, gzipBytes: 40_000 },
  "dist/raw2d.umd.cjs": { bytes: 125_000, gzipBytes: 35_000 },
  "dist/index.js": { bytes: 65_000, gzipBytes: 18_000 }
};

const rootManifest = await readJson("package.json");
const version = rootManifest.version;
const manifests = await readPackageManifests();
const packEntries = await readPackEntries();
const report = await createReport(manifests, packEntries);
const issues = createIssues(report);

if (process.argv.includes("--json")) {
  console.log(JSON.stringify({ ...report, issues }, null, 2));
} else {
  printReport(report, issues);
}

if (process.argv.includes("--check") && issues.length > 0) {
  process.exitCode = 1;
}

async function readPackageManifests() {
  return Promise.all(expectedPackages.map(async (name) => {
    const directory = name === "raw2d" ? "packages/raw2d" : `packages/${name.replace("raw2d-", "")}`;
    return { directory, manifest: await readJson(`${directory}/package.json`) };
  }));
}

async function readPackEntries() {
  const output = await runForOutput("npm", ["pack", "--workspaces", "--dry-run", "--json", "--silent"]);
  return JSON.parse(output);
}

async function createReport(packageManifests, packageEntries) {
  return {
    version,
    packages: await Promise.all(packageManifests.map((entry) => createPackageReport(entry, packageEntries))),
    freshInstallScripts: readFreshInstallScripts(),
    cdn: await readCdnReport()
  };
}

async function createPackageReport({ directory, manifest }, packageEntries) {
  const pack = packageEntries.find((entry) => entry.name === manifest.name);
  const entryFiles = await measureEntryFiles(directory, manifest);

  return {
    name: manifest.name,
    directory,
    version: manifest.version,
    sideEffects: manifest.sideEffects,
    files: manifest.files ?? [],
    dependencies: pickRaw2DDeps(manifest.dependencies ?? {}),
    peerDependencies: pickRaw2DDeps(manifest.peerDependencies ?? {}),
    entryFiles,
    pack: pack ? {
      filename: pack.filename,
      version: pack.version,
      size: pack.size,
      unpackedSize: pack.unpackedSize,
      files: pack.files.map((file) => file.path)
    } : null
  };
}

async function measureEntryFiles(directory, manifest) {
  const entries = new Set([manifest.module, manifest.main].filter(Boolean));
  return Promise.all(Array.from(entries).map(async (entry) => {
    const relativePath = entry.replace(/^\.\//, "");
    const absolutePath = path.join(root, directory, relativePath);
    const content = await readFile(absolutePath);
    return {
      path: relativePath,
      bytes: (await stat(absolutePath)).size,
      gzipBytes: gzipSync(content).byteLength
    };
  }));
}

async function readCdnReport() {
  const raw2d = manifests.find((entry) => entry.manifest.name === "raw2d")?.manifest;
  return {
    version,
    module: raw2d?.module,
    main: raw2d?.main,
    unpkg: raw2d?.unpkg,
    jsdelivr: raw2d?.jsdelivr,
    urls: createCdnUrls()
  };
}

function readFreshInstallScripts() {
  const scripts = rootManifest.scripts ?? {};
  return [
    "test:consumer",
    "test:consumer:umbrella",
    "test:consumer:canvas",
    "test:consumer:webgl",
    "test:consumer:focused",
    "test:consumer:mcp",
    "test:consumer:react"
  ].map((name) => ({ name, command: scripts[name] ?? "" }));
}

function createIssues(report) {
  return [
    ...checkPackageNames(report.packages),
    ...report.packages.flatMap(checkPackage),
    ...checkFreshInstallScripts(report.freshInstallScripts),
    ...checkCdn(report.cdn)
  ];
}

function checkPackageNames(packages) {
  const names = packages.map((entry) => entry.name).sort();
  return JSON.stringify(names) === JSON.stringify([...expectedPackages].sort()) ? [] : ["Public package set does not match the final readiness list."];
}

function checkPackage(entry) {
  const budget = packBudgets[entry.name] ?? packBudgets.default;
  const issues = [];

  if (entry.version !== version) issues.push(`${entry.name} version must match ${version}.`);
  if (entry.sideEffects !== false) issues.push(`${entry.name} must keep sideEffects false.`);
  for (const requiredFile of ["dist", "README.md", "LICENSE", "NOTICE", "TRADEMARKS.md"]) {
    if (!entry.files.includes(requiredFile)) issues.push(`${entry.name} package files must include ${requiredFile}.`);
  }
  for (const [name, dependencyVersion] of [...Object.entries(entry.dependencies), ...Object.entries(entry.peerDependencies)]) {
    if (dependencyVersion !== version) issues.push(`${entry.name} ${name} must pin ${version}.`);
  }
  if (!entry.pack) {
    issues.push(`${entry.name} must appear in npm pack dry-run output.`);
  } else {
    if (entry.pack.version !== version) issues.push(`${entry.name} pack version must match ${version}.`);
    if (entry.pack.size > budget.size) issues.push(`${entry.name} tarball exceeds ${budget.size} bytes.`);
    if (entry.pack.unpackedSize > budget.unpackedSize) issues.push(`${entry.name} unpacked size exceeds ${budget.unpackedSize} bytes.`);
  }
  return [...issues, ...entry.entryFiles.flatMap(checkEntryFile)];
}

function checkEntryFile(entry) {
  const budget = entryBudgets[entry.path] ?? entryBudgets["dist/index.js"];
  const issues = [];

  if (entry.bytes > budget.bytes) issues.push(`${entry.path} exceeds ${budget.bytes} bytes.`);
  if (entry.gzipBytes > budget.gzipBytes) issues.push(`${entry.path} exceeds ${budget.gzipBytes} gzip bytes.`);
  return issues;
}

function checkFreshInstallScripts(scripts) {
  return scripts.filter((script) => script.command.length === 0).map((script) => `${script.name} must be defined for fresh install audits.`);
}

function checkCdn(cdn) {
  const issues = [];
  if (cdn.module !== "./dist/raw2d.js") issues.push("raw2d module must point at dist/raw2d.js for CDN ESM.");
  if (cdn.main !== "./dist/raw2d.umd.cjs") issues.push("raw2d main must point at dist/raw2d.umd.cjs for CDN UMD.");
  if (cdn.unpkg !== cdn.jsdelivr) issues.push("raw2d unpkg and jsdelivr fields must match.");
  if (cdn.urls.length !== expectedPackages.length + 1) issues.push("CDN audit must cover every focused package plus raw2d ESM and UMD.");
  for (const url of cdn.urls) {
    if (!/^https:\/\/cdn\.jsdelivr\.net\/npm\/raw2d(?:-[a-z0-9-]+)?@\d+\.\d+\.\d+\/dist\/(?:index\.js|raw2d\.js|raw2d\.umd\.cjs)$/.test(url)) {
      issues.push(`Invalid CDN URL: ${url}`);
    }
  }
  return issues;
}

function pickRaw2DDeps(deps) {
  return Object.fromEntries(Object.entries(deps).filter(([name]) => name.startsWith("raw2d")));
}

function createCdnUrls() {
  return expectedPackages.flatMap((name) => {
    if (name === "raw2d") {
      return [
        `https://cdn.jsdelivr.net/npm/raw2d@${version}/dist/raw2d.js`,
        `https://cdn.jsdelivr.net/npm/raw2d@${version}/dist/raw2d.umd.cjs`
      ];
    }

    return [`https://cdn.jsdelivr.net/npm/${name}@${version}/dist/index.js`];
  });
}

async function readJson(file) {
  return JSON.parse(await readFile(path.join(root, file), "utf8"));
}

function runForOutput(command, args) {
  const child = spawn(command, args, {
    cwd: root,
    env: { ...process.env, npm_config_fund: "false", npm_config_audit: "false" },
    shell: process.platform === "win32",
    stdio: ["ignore", "pipe", "inherit"]
  });
  let output = "";
  child.stdout.on("data", (chunk) => {
    output += chunk.toString();
  });
  return new Promise((resolve, reject) => {
    child.on("close", (code) => code === 0 ? resolve(output) : reject(new Error(`${command} ${args.join(" ")} failed with ${code}`)));
  });
}

function printReport(report, issues) {
  console.log(`Raw2D package readiness audit v${report.version}`);
  for (const entry of report.packages) {
    console.log(`- ${entry.name}: ${entry.pack?.size ?? 0} bytes packed, ${entry.entryFiles.length} entry file(s)`);
  }
  console.log(`fresh install scripts: ${report.freshInstallScripts.length}`);
  console.log(`cdn entry: ${report.cdn.module} / ${report.cdn.main}`);
  console.log(`issues: ${issues.length}`);
  for (const issue of issues) console.log(`- ${issue}`);
}

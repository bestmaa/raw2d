import { readFile } from "node:fs/promises";
import { spawnSync } from "node:child_process";

const mode = process.argv[2] ?? "preflight";
const packageJson = JSON.parse(await readFile(new URL("../package.json", import.meta.url), "utf8"));
const version = packageJson.version;
const packages = [
  "raw2d-core",
  "raw2d-effects",
  "raw2d-text",
  "raw2d-sprite",
  "raw2d-interaction",
  "raw2d-mcp",
  "raw2d-canvas",
  "raw2d-webgl",
  "raw2d",
  "raw2d-react",
  "raw2d-react-fiber"
];

if (mode === "preflight") {
  assertTagMatchesVersion();
  run("npm", ["whoami"], { NODE_AUTH_TOKEN: process.env.NODE_AUTH_TOKEN ?? "" });
  assertPackagesAreUnpublished();
  console.log(`release-preflight-ok v${version}`);
} else if (mode === "postpublish") {
  await assertPackagesArePublished();
  console.log(`release-postpublish-ok v${version}`);
} else {
  throw new Error(`Unknown release publish check mode: ${mode}`);
}

function assertTagMatchesVersion() {
  const refType = process.env.GITHUB_REF_TYPE;
  const refName = process.env.GITHUB_REF_NAME;

  if (refType !== "tag") {
    throw new Error(`Publish workflow must run from a tag. Received GITHUB_REF_TYPE=${refType ?? "unset"}.`);
  }

  if (refName !== `v${version}`) {
    throw new Error(`Publish tag ${refName ?? "unset"} does not match package version v${version}.`);
  }
}

function assertPackagesAreUnpublished() {
  for (const packageName of packages) {
    const result = spawnSync("npm", ["view", `${packageName}@${version}`, "version"], {
      encoding: "utf8",
      env: process.env
    });

    if (result.status === 0) {
      throw new Error(`${packageName}@${version} is already published.`);
    }

    if (!/E404|404|not found/i.test(`${result.stderr}\n${result.stdout}`)) {
      throw new Error(`Could not verify unpublished state for ${packageName}@${version}: ${result.stderr || result.stdout}`);
    }
  }
}

async function assertPackagesArePublished() {
  for (const packageName of packages) {
    const output = await viewPublishedVersion(packageName);

    if (output.trim() !== version) {
      throw new Error(`${packageName} latest is ${output.trim()}, expected ${version}.`);
    }
  }
}

async function viewPublishedVersion(packageName) {
  const attempts = 6;
  let lastError = "";

  for (let attempt = 1; attempt <= attempts; attempt += 1) {
    try {
      return run("npm", ["view", packageName, "version"]);
    } catch (error) {
      lastError = error instanceof Error ? error.message : String(error);

      if (attempt < attempts) {
        await delay(5000);
      }
    }
  }

  throw new Error(`Could not verify latest version for ${packageName}: ${lastError}`);
}

function run(command, args, extraEnv = {}) {
  const result = spawnSync(command, args, {
    encoding: "utf8",
    env: { ...process.env, ...extraEnv }
  });

  if (result.status !== 0) {
    throw new Error(`Command failed: ${command} ${args.join(" ")}\n${result.stderr || result.stdout}`);
  }

  return result.stdout;
}

function delay(ms) {
  return new Promise((resolve) => {
    setTimeout(resolve, ms);
  });
}

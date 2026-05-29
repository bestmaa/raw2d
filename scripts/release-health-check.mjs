import { readFile } from "node:fs/promises";
import { spawn } from "node:child_process";

const dry = process.argv.includes("--dry");
const packageJson = JSON.parse(await readFile(new URL("../package.json", import.meta.url), "utf8"));
const version = packageJson.version;
const routes = [
  "https://raw2d.com/",
  "https://raw2d.com/doc",
  "https://raw2d.com/readme",
  "https://raw2d.com/examples/",
  "https://raw2d.com/examples/canvas-basic/",
  "https://raw2d.com/studio",
  "https://raw2d.com/cdn-smoke",
  "https://raw2d.com/benchmark",
  "https://raw2d.com/visual-test"
];

await run("npm", ["run", "release:postpublish"]);
await run("npm", ["run", "test:consumer:registry"]);
await run("npm", ["run", "test:cdn:pinned", ...(dry ? [] : ["--", "--live"])]);

if (!dry) {
  for (const route of routes) {
    await assertPublicRoute(route);
  }
}

console.log(`release-health-ok raw2d@${version}${dry ? " dry" : " live"}`);

async function assertPublicRoute(route) {
  const attempts = 4;
  let lastStatus = "unknown";

  for (let attempt = 1; attempt <= attempts; attempt += 1) {
    const response = await fetch(route, { method: "GET" });

    if (response.ok) {
      return;
    }

    lastStatus = String(response.status);

    if (attempt < attempts) {
      await delay(5000);
    }
  }

  throw new Error(`Public route failed: ${route} ${lastStatus}`);
}

async function run(command, args) {
  const child = spawn(command, args, {
    env: { ...process.env, npm_config_fund: "false", npm_config_audit: "false" },
    shell: process.platform === "win32",
    stdio: "inherit"
  });
  const code = await new Promise((resolve) => {
    child.on("error", resolve);
    child.on("close", resolve);
  });

  if (code !== 0) {
    throw new Error(`Command failed: ${command} ${args.join(" ")}`);
  }
}

function delay(ms) {
  return new Promise((resolve) => {
    setTimeout(resolve, ms);
  });
}

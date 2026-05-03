#!/usr/bin/env node
import { spawn } from "node:child_process";
import path from "node:path";
import { fileURLToPath } from "node:url";

const pluginRoot = fileURLToPath(new URL("../", import.meta.url));
const repoRoot = path.resolve(pluginRoot, "../..");
const options = parseArgs(process.argv.slice(2));
const command = process.execPath;
const args = ["--test", "tests/webgl/visual-regression.test.mjs"];

if (options.dryRun) {
  const result = {
    ok: true,
    type: "visual-pixel-test-plan",
    cwd: repoRoot,
    command,
    args
  };

  console.log(options.json ? JSON.stringify(result, null, 2) : `${command} ${args.join(" ")}`);
  process.exit(0);
}

const code = await run(command, args, repoRoot);
const result = {
  ok: code === 0,
  type: "visual-pixel-test-result",
  command,
  args,
  exitCode: code
};

if (options.json) {
  console.log(JSON.stringify(result, null, 2));
}

process.exit(code);

function parseArgs(argsToParse) {
  const result = { dryRun: false, json: false };

  for (const arg of argsToParse) {
    if (arg === "--dry-run") {
      result.dryRun = true;
    } else if (arg === "--json") {
      result.json = true;
    } else {
      throw new Error(`Unknown argument: ${arg}`);
    }
  }

  return result;
}

function run(commandToRun, argsToRun, cwd) {
  const child = spawn(commandToRun, argsToRun, {
    cwd,
    env: { ...process.env },
    stdio: "inherit"
  });

  return new Promise((resolve) => {
    child.on("close", resolve);
  });
}


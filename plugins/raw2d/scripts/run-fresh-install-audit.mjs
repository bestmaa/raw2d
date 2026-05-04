#!/usr/bin/env node
import { spawn } from "node:child_process";
import path from "node:path";
import { fileURLToPath } from "node:url";

const pluginRoot = fileURLToPath(new URL("../", import.meta.url));
const repoRoot = path.resolve(pluginRoot, "../..");
const options = parseArgs(process.argv.slice(2));
const commands = [
  { command: "npm", args: ["run", "pack:check", "--", "--silent"] },
  { command: "npm", args: ["run", "test:consumer"] }
];

if (options.dryRun) {
  printResult({ ok: true, type: "fresh-install-audit-plan", cwd: repoRoot, commands });
  process.exit(0);
}

const results = [];

for (const command of commands) {
  const exitCode = await run(command.command, command.args, repoRoot);
  results.push({ ...command, exitCode });

  if (exitCode !== 0) {
    break;
  }
}

const result = {
  ok: results.every((entry) => entry.exitCode === 0),
  type: "fresh-install-audit-result",
  cwd: repoRoot,
  results
};

printResult(result);
process.exit(result.ok ? 0 : 1);

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

function printResult(result) {
  if (options.json) {
    console.log(JSON.stringify(result, null, 2));
    return;
  }

  console.log(`Raw2D ${result.type}: ${result.ok ? "ok" : "failed"}`);

  for (const command of result.commands ?? result.results) {
    console.log(`${command.command} ${command.args.join(" ")}`);
  }
}

function run(commandToRun, argsToRun, cwd) {
  const child = spawn(commandToRun, argsToRun, {
    cwd,
    env: { ...process.env },
    shell: process.platform === "win32",
    stdio: "inherit"
  });

  return new Promise((resolve) => {
    child.on("close", resolve);
  });
}

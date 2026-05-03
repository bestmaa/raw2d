#!/usr/bin/env node
import { readdir, readFile, stat } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

const pluginRoot = fileURLToPath(new URL("../", import.meta.url));
const repoRoot = path.resolve(pluginRoot, "../..");
const options = parseArgs(process.argv.slice(2));
const result = await runDocsQa(repoRoot);

if (options.json) {
  console.log(JSON.stringify(result, null, 2));
} else {
  printSummary(result);
}

if (!result.ok) {
  process.exit(1);
}

export async function runDocsQa(root) {
  const docsDir = path.join(root, "docs");
  const hiDocsDir = path.join(docsDir, "hi");
  const docs = await listMarkdown(docsDir);
  const hiDocs = new Set(await listMarkdown(hiDocsDir));
  const issues = [];

  for (const doc of docs) {
    if (!hiDocs.has(doc)) {
      issues.push({ type: "missing-hinglish-doc", file: `docs/hi/${doc}` });
    }
  }

  await checkNoTodo(root, ["docs", "README.md", "packages/raw2d/README.md"], issues);
  await checkRequiredFiles(root, [
    "README.md",
    "docs/GettingStarted.md",
    "docs/hi/GettingStarted.md",
    "docs/PublicAPI.md",
    "docs/hi/PublicAPI.md",
    "RELEASE_NOTES.md"
  ], issues);

  return {
    ok: issues.length === 0,
    docsCount: docs.length,
    hinglishDocsCount: hiDocs.size,
    issues
  };
}

function parseArgs(args) {
  const result = { json: false };

  for (const arg of args) {
    if (arg === "--json") {
      result.json = true;
    } else {
      throw new Error(`Unknown argument: ${arg}`);
    }
  }

  return result;
}

async function listMarkdown(directory) {
  const entries = await readdir(directory, { withFileTypes: true });

  return entries
    .filter((entry) => entry.isFile() && entry.name.endsWith(".md"))
    .map((entry) => entry.name)
    .sort();
}

async function checkNoTodo(root, targets, issues) {
  for (const target of targets) {
    const fullPath = path.join(root, target);
    const targetStat = await stat(fullPath);

    if (targetStat.isDirectory()) {
      await checkDirectoryNoTodo(fullPath, path.relative(root, fullPath), issues);
    } else {
      await checkFileNoTodo(fullPath, target, issues);
    }
  }
}

async function checkDirectoryNoTodo(directory, relativeDirectory, issues) {
  const entries = await readdir(directory, { withFileTypes: true });

  for (const entry of entries) {
    const fullPath = path.join(directory, entry.name);
    const relativePath = path.join(relativeDirectory, entry.name).replaceAll("\\", "/");

    if (entry.isDirectory()) {
      await checkDirectoryNoTodo(fullPath, relativePath, issues);
    } else if (entry.isFile() && entry.name.endsWith(".md")) {
      await checkFileNoTodo(fullPath, relativePath, issues);
    }
  }
}

async function checkFileNoTodo(fullPath, relativePath, issues) {
  const text = await readFile(fullPath, "utf8");

  if (/\[TODO:|TODO\b/.test(text)) {
    issues.push({ type: "todo-placeholder", file: relativePath });
  }
}

async function checkRequiredFiles(root, files, issues) {
  for (const file of files) {
    try {
      await stat(path.join(root, file));
    } catch {
      issues.push({ type: "missing-required-file", file });
    }
  }
}

function printSummary(result) {
  console.log(`Raw2D docs QA: ${result.ok ? "ok" : "failed"}`);
  console.log(`docs: ${result.docsCount}`);
  console.log(`hinglishDocs: ${result.hinglishDocsCount}`);

  for (const issue of result.issues) {
    console.log(`${issue.type}: ${issue.file}`);
  }
}


#!/usr/bin/env node
import { readFile } from "node:fs/promises";

const options = parseArgs(process.argv.slice(2));
const stats = await loadStats(options);
const explanation = explainRendererStats(stats);

if (options.json) {
  console.log(JSON.stringify(explanation, null, 2));
} else {
  console.log(explanation.lines.join("\n"));
}

export function explainRendererStats(stats) {
  const renderer = stringValue(stats.renderer, "unknown");
  const objects = numberValue(stats.objects);
  const drawCalls = numberValue(stats.drawCalls);
  const textureBinds = numberValue(stats.textureBinds);
  const fps = numberValue(stats.fps);
  const frameMs = numberValue(stats.frameMs);
  const staticHits = numberValue(stats.staticCacheHits);
  const staticMisses = numberValue(stats.staticCacheMisses);
  const lines = [
    `renderer: ${renderer}`,
    `objects: ${formatNumber(objects)}`,
    `drawCalls: ${formatNumber(drawCalls)}`,
    `textureBinds: ${formatNumber(textureBinds)}`,
    `fps: ${formatNumber(fps)}`,
    `frameMs: ${formatNumber(frameMs)}`
  ];
  const notes = [];

  if (drawCalls !== null && objects !== null) {
    notes.push(drawCalls <= Math.max(1, objects / 10)
      ? "draw calls look batched for the object count"
      : "draw calls are high; check material, texture, and zIndex grouping");
  }

  if (textureBinds !== null) {
    notes.push(textureBinds <= 1
      ? "texture binds are low; atlas or texture grouping is working"
      : "texture binds are above one; atlas packing may reduce binds");
  }

  if (staticHits !== null || staticMisses !== null) {
    lines.push(`staticCacheHits: ${formatNumber(staticHits)}`);
    lines.push(`staticCacheMisses: ${formatNumber(staticMisses)}`);
    notes.push(staticHits !== null && staticHits > 0
      ? "static cache is being reused"
      : "static cache has no hits yet; first frame or dirty objects may explain it");
  }

  if (fps !== null) {
    notes.push(fps >= 55
      ? "fps is near realtime on this machine"
      : "fps is below realtime; inspect frame time before changing architecture");
  }

  return {
    ok: true,
    renderer,
    lines,
    notes
  };
}

function parseArgs(args) {
  const result = { json: false, sample: false };

  for (let index = 0; index < args.length; index += 1) {
    const arg = args[index];
    const value = args[index + 1];

    if (arg === "--json") {
      result.json = true;
    } else if (arg === "--sample") {
      result.sample = true;
    } else if (arg === "--input") {
      result.input = requireValue(arg, value);
      index += 1;
    } else if (arg === "--file") {
      result.file = requireValue(arg, value);
      index += 1;
    } else {
      throw new Error(`Unknown argument: ${arg}`);
    }
  }

  return result;
}

async function loadStats(options) {
  if (options.sample) {
    return {
      renderer: "WebGLRenderer2D",
      objects: 280,
      drawCalls: 4,
      textureBinds: 1,
      fps: 960,
      frameMs: 1.04,
      staticCacheHits: 1,
      staticCacheMisses: 0
    };
  }

  if (options.input) {
    return JSON.parse(options.input);
  }

  if (options.file) {
    return JSON.parse(await readFile(options.file, "utf8"));
  }

  throw new Error("Use --sample, --input <json>, or --file <path>.");
}

function requireValue(name, value) {
  if (!value || value.startsWith("--")) {
    throw new Error(`Missing value for ${name}.`);
  }

  return value;
}

function numberValue(value) {
  return typeof value === "number" && Number.isFinite(value) ? value : null;
}

function stringValue(value, fallback) {
  return typeof value === "string" && value.length > 0 ? value : fallback;
}

function formatNumber(value) {
  return value === null ? "n/a" : String(Math.round(value * 100) / 100);
}


import type { WebGLColor } from "./WebGLColor.type.js";

export function parseWebGLColor(color: string): WebGLColor {
  const normalized = color.trim().toLowerCase();

  if (normalized.startsWith("#")) {
    return parseHexColor(normalized);
  }

  if (normalized.startsWith("rgb")) {
    return parseRgbColor(normalized);
  }

  return { r: 1, g: 1, b: 1, a: 1 };
}

function parseHexColor(color: string): WebGLColor {
  const value = color.slice(1);

  if (value.length === 3) {
    return {
      r: parseInt(value[0] + value[0], 16) / 255,
      g: parseInt(value[1] + value[1], 16) / 255,
      b: parseInt(value[2] + value[2], 16) / 255,
      a: 1
    };
  }

  if (value.length === 6) {
    return {
      r: parseInt(value.slice(0, 2), 16) / 255,
      g: parseInt(value.slice(2, 4), 16) / 255,
      b: parseInt(value.slice(4, 6), 16) / 255,
      a: 1
    };
  }

  return { r: 1, g: 1, b: 1, a: 1 };
}

function parseRgbColor(color: string): WebGLColor {
  const match = color.match(/rgba?\(([^)]+)\)/);

  if (!match) {
    return { r: 1, g: 1, b: 1, a: 1 };
  }

  const values = match[1].split(",").map((value) => Number(value.trim()));

  return {
    r: clampColor(values[0] ?? 255),
    g: clampColor(values[1] ?? 255),
    b: clampColor(values[2] ?? 255),
    a: Math.max(0, Math.min(1, values[3] ?? 1))
  };
}

function clampColor(value: number): number {
  return Math.max(0, Math.min(255, value)) / 255;
}


import type { DocCopyImportRule } from "./DocCopyCode.type";

const raw2dSymbols = [
  "Arc",
  "AssetGroupLoader",
  "BasicMaterial",
  "Camera2D",
  "CameraControls",
  "Canvas",
  "CanvasRenderer",
  "Circle",
  "Ellipse",
  "Group2D",
  "InteractionController",
  "KeyboardController",
  "Line",
  "Polygon",
  "Polyline",
  "Rect",
  "Scene",
  "ShapePath",
  "Sprite",
  "Text2D",
  "Texture",
  "TextureAtlas",
  "TextureAtlasLoader",
  "TextureLoader",
  "WebGLRenderer2D",
  "containsPoint",
  "getCameraWorldBounds",
  "getSpriteLocalBounds",
  "getVisibleObjects",
  "isWebGL2Available",
  "measureText2DLocalBounds",
  "pickObject"
] as const;

const raw2dRules: readonly DocCopyImportRule[] = raw2dSymbols.map((symbol) => ({
  symbol,
  packageName: "raw2d"
}));

export function getCopyFriendlyCode(code: string): string {
  if (!shouldAddPackageImports(code)) {
    return code;
  }

  const symbols = getUsedSymbols(code, raw2dRules);

  if (symbols.length === 0) {
    return code;
  }

  return `${createImportLine(symbols)}\n\n${code}`;
}

function shouldAddPackageImports(code: string): boolean {
  const trimmed = code.trim();

  if (!trimmed || hasOwnImports(trimmed)) {
    return false;
  }

  if (isCommandOrMarkup(trimmed)) {
    return false;
  }

  return /(?:const|let|await|new|=>|\(|\);)/.test(trimmed);
}

function hasOwnImports(code: string): boolean {
  return /\bimport\s+[\s\S]+?\s+from\s+["']/.test(code);
}

function isCommandOrMarkup(code: string): boolean {
  return /^(?:npm |node |npx |curl |git |http|\/|<)/.test(code);
}

function getUsedSymbols(code: string, rules: readonly DocCopyImportRule[]): readonly string[] {
  const used = rules
    .filter((rule) => new RegExp(`\\b${rule.symbol}\\b`).test(code))
    .map((rule) => rule.symbol);
  return [...new Set(used)].sort((left, right) => left.localeCompare(right));
}

function createImportLine(symbols: readonly string[]): string {
  return `import { ${symbols.join(", ")} } from "raw2d";`;
}

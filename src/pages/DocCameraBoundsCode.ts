import type { DocSection } from "./DocPage.type";

export function createCameraBoundsCode(section: DocSection): string {
  return withFocusComment(`import { Camera2D, getCameraWorldBounds } from "raw2d";

const camera = new Camera2D({
  x: 100,
  y: 80,
  zoom: 2
});

const bounds = getCameraWorldBounds({
  camera,
  width: 800,
  height: 600
});

console.log(bounds.x, bounds.y, bounds.width, bounds.height);`, section);
}

function withFocusComment(example: string, section: DocSection): string {
  return `${example}

// Focus: ${section.title}
${commentBlock(section.code ?? section.body)}`;
}

function commentBlock(value: string): string {
  return value
    .split("\n")
    .map((line) => `// ${line}`)
    .join("\n");
}

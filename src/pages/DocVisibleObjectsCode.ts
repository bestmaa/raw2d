import type { DocSection } from "./DocPage.type";

export function createVisibleObjectsCode(section: DocSection): string {
  return withFocusComment(`import { Camera2D, getVisibleObjects } from "raw2d";

const camera = new Camera2D({
  x: 0,
  y: 0,
  zoom: 1
});

const visibleObjects = getVisibleObjects({
  scene,
  camera,
  width: 800,
  height: 600
});

for (const object of visibleObjects) {
  console.log(object.name || object.id);
}`, section);
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

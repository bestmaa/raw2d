import type { DocTopic } from "./DocPage.type";

export const rendererParityTopics: readonly DocTopic[] = [
  {
    id: "renderer-parity",
    label: "Renderer Parity",
    title: "Renderer Parity Matrix",
    description: "Check which Raw2D object kinds are supported by Canvas and WebGL.",
    sections: [
      {
        title: "Read The Matrix",
        body: "Use getRendererSupportMatrix when docs, demos, or tools need the current Canvas/WebGL support state.",
        code: `import { getRendererSupportMatrix } from "raw2d";

const matrix = getRendererSupportMatrix();

console.table(matrix);`
      },
      {
        title: "Support Levels",
        body: "supported means the renderer should draw it normally. partial means it works with a known limitation. unsupported means the renderer intentionally skips it for now.",
        code: `for (const entry of getRendererSupportMatrix()) {
  console.log(entry.kind, entry.canvas, entry.webgl, entry.note);
}`
      },
      {
        title: "Choose A Renderer",
        body: "Canvas is the full reference renderer. WebGL is batch-first, so use the matrix before presenting a WebGL-only feature.",
        code: `const canUseWebGL = getRendererSupportMatrix().some((entry) => {
  return entry.kind === "Sprite" && entry.webgl === "supported";
});

const renderer = canUseWebGL
  ? new WebGLRenderer2D({ canvas })
  : new Canvas({ canvas });`
      },
      {
        title: "Partial Support",
        body: "Partial support is still useful, but the limitation should be visible to users. ShapePath is partial because WebGL supports simple fill/stroke, while complex fill rules still need Canvas.",
        code: `const pathSupport = getRendererSupportMatrix().find((entry) => {
  return entry.kind === "ShapePath";
});

console.log(pathSupport?.webgl);
console.log(pathSupport?.note);`
      }
    ]
  }
];

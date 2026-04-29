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
        title: "Current Checklist",
        body: "Canvas is the correctness baseline. WebGL is mostly aligned now; ShapePath has an opt-in rasterize fallback, while large dynamic Text2D workloads still need stronger cache work.",
        code: `for (const entry of getRendererSupportMatrix()) {
  console.log({
    object: entry.kind,
    canvas: entry.canvas,
    webgl: entry.webgl,
    priority: entry.priority ?? "done"
  });
}`
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
        title: "Active Renderer Support",
        body: "When a renderer instance already exists, call getSupport to read that renderer's object support directly.",
        code: `const support = renderer.getSupport();

console.log(support.renderer);
console.log(support.objects.Rect);
console.log(support.objects.ShapePath);
console.log(support.notes.ShapePath);`
      },
      {
        title: "Partial Support",
        body: "Partial support is still useful, but the limitation should be visible to users. ShapePath is partial because complex fills need the opt-in rasterize fallback instead of direct GPU geometry.",
        code: `const pathSupport = getRendererSupportMatrix().find((entry) => {
  return entry.kind === "ShapePath";
});

console.log(pathSupport?.webgl);
console.log(pathSupport?.note);`
      },
      {
        title: "Missing Support Plan",
        body: "The next WebGL parity work should stay ordered: stronger Text2D cache first, stroke polish second, direct ShapePath GPU fill third, then performance proof updates.",
        code: `const planned = getRendererSupportMatrix()
  .filter((entry) => entry.webgl === "partial" || entry.webgl === "unsupported")
  .map((entry) => ({
    kind: entry.kind,
    priority: entry.priority,
    limitation: entry.limitation,
    nextStep: entry.nextStep
  }));

console.table(planned);`
      }
    ]
  }
];

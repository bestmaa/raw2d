import type { DocTopic } from "./DocPage.type";

export const showcaseTopics: readonly DocTopic[] = [
  {
    id: "showcase-demo",
    label: "Showcase Demo",
    title: "Showcase Demo",
    description: "The real-world demo that proves Raw2D rendering, interaction, camera, and batching together.",
    sections: [
      {
        title: "Purpose",
        body: "The showcase is not a marketing page. It is a runnable stress scene that explains when Raw2D should use Canvas and when it should use WebGL.",
        code: `// Showcase goal:
// one scene, two renderers, visible stats, real interaction.
// Canvas proves correctness.
// WebGL proves batching pressure and texture behavior.`
      },
      {
        title: "What It Proves",
        body: "The demo proves that Raw2D keeps one explicit scene graph while renderer decisions stay visible. A user can switch Canvas/WebGL, change batching options, move the camera, and inspect the result without hidden engine magic.",
        code: `const proofPoints = [
  "same Scene and Camera2D",
  "Canvas as the readable baseline",
  "WebGL as the batch-first path",
  "stats that expose draw calls and texture binds"
];`
      },
      {
        title: "Scene Scope",
        body: "The scene should include many sprites, simple shapes, text labels, static background objects, and dynamic selected objects.",
        code: `const targetScene = {
  sprites: 320,
  shapes: 120,
  textLabels: 24,
  staticObjects: "background tiles and decoration",
  dynamicObjects: "selected objects and animated sprites"
};`
      },
      {
        title: "Renderer Targets",
        body: "Canvas and WebGL should render the same scene. The UI should expose FPS, frame time, draw calls, texture binds, static cache hits, and skipped unsupported objects.",
        code: `const performanceTargets = {
  canvas: "correct output and easy debugging",
  webgl: "lower draw calls with batching and atlas usage",
  shared: "same Scene, same Camera2D, same objects"
};`
      },
      {
        title: "Use It For Decisions",
        body: "Use the controls to decide whether a real project needs Canvas simplicity, WebGL batching, atlas sorting, culling, or static batches. The answer should come from visible behavior and stats, not guesswork.",
        code: `// Practical reading:
// Many unique textures -> atlas sorting should reduce texture pressure.
// Many background objects -> static batches should help WebGL.
// Large scene outside camera -> culling should reduce work.`
      },
      {
        title: "Acceptance Checks",
        body: "Each showcase step must include a browser check. The demo is only useful when users can see the renderer switch, camera controls, interaction, and stats changing live.",
        code: `npm run build:docs
npm run test:browser

// Manual browser checks:
// /examples/showcase/
// /doc#showcase-demo`
      }
    ]
  }
];

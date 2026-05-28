import type { DocTopic } from "./DocPage.type";

export const apiFreezeTopics: readonly DocTopic[] = [
  {
    id: "api-freeze-checklist",
    label: "API Freeze Checklist",
    title: "Final API Freeze Checklist",
    description: "Use this checklist before Raw2D is treated as a stable v1 API.",
    sections: [
      {
        title: "Names To Freeze",
        body: "Freeze package names, public exports, class names, constructor option fields, renderer lifecycle methods, documented aliases, and separate integration package surfaces.",
        code: `raw2d, raw2d-core, raw2d-canvas, raw2d-webgl
raw2d-sprite, raw2d-text, raw2d-effects, raw2d-interaction
raw2d-mcp, raw2d-react, raw2d-react-fiber
Scene, Camera2D, CanvasRenderer, WebGLRenderer2D
render(scene, camera), setSize(width, height), dispose()`
      },
      {
        title: "Surface Matrix",
        body: "The umbrella package keeps app-level exports and aliases. Focused packages keep renderer, effects, MCP, React, and React Fiber surfaces separate and not re-exported from raw2d.",
        code: `raw2d -> app-level API
raw2d-webgl -> WebGL helpers
raw2d-effects -> effect descriptors
raw2d-mcp -> automation helpers
raw2d-react-fiber -> reconciler boundary`
      },
      {
        title: "Audit Commands",
        body: "Run public surface and package metadata audits before tagging v1. These should catch accidental internals and bad export maps.",
        code: `npm run typecheck
node --test tests/package/public-surface-audit.test.mjs
node --test tests/package/core-exports.test.mjs tests/package/canvas-exports.test.mjs tests/package/webgl-exports.test.mjs tests/package/focused-exports.test.mjs tests/package/imports.test.mjs
node --test tests/package/metadata-audit.test.mjs
npm run pack:check -- --silent`
      },
      {
        title: "Breaking Change Rule",
        body: "After v1, any rename, removed export, constructor field change, or behavior change needs a migration note and semver decision.",
        code: `Rename -> breaking
Remove export -> breaking
Constructor field change -> breaking
Renderer behavior change -> document and version intentionally`
      },
      {
        title: "Migration Notes",
        body: "Every deprecation should name the old import, preferred import, and alias lifetime. Raw2D v1 keeps Canvas as an alias for CanvasRenderer and schedules no runtime export removals in this freeze.",
        code: `import { Canvas, CanvasRenderer } from "raw2d";

Canvas === CanvasRenderer;`
      }
    ]
  }
];

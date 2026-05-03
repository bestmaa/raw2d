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
        body: "Freeze package names, public exports, class names, constructor option fields, renderer lifecycle methods, and documented aliases.",
        code: `raw2d, raw2d-core, raw2d-canvas, raw2d-webgl
Scene, Camera2D, CanvasRenderer, WebGLRenderer2D
render(scene, camera), setSize(width, height), dispose()`
      },
      {
        title: "Audit Commands",
        body: "Run public surface and package metadata audits before tagging v1. These should catch accidental internals and bad export maps.",
        code: `node --test tests/package/public-surface-audit.test.mjs
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
      }
    ]
  }
];

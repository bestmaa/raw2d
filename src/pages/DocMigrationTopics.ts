import type { DocTopic } from "./DocPage.type";

export const migrationTopics: readonly DocTopic[] = [
  {
    id: "pre-v1-migration",
    label: "Pre-v1 Migration",
    title: "Pre-v1 Migration Guide",
    description: "Use this guide when moving Raw2D code across pre-v1 releases.",
    sections: [
      {
        title: "Current Stability Level",
        body: "Raw2D is still pre-v1, so APIs may improve. Public names are now audited before release, and old names should stay as aliases before removal.",
        code: `// Prefer stable app-level imports.
import { CanvasRenderer, Rect, Scene } from "raw2d";

// Existing code can keep using Canvas.
import { Canvas } from "raw2d";`
      },
      {
        title: "Canvas To CanvasRenderer",
        body: "Canvas remains a compatibility alias. New renderer-focused examples should use CanvasRenderer for naming parity with WebGLRenderer2D.",
        code: `// Before:
const renderer = new Canvas({ canvas });

// Preferred now:
const renderer = new CanvasRenderer({ canvas });`
      },
      {
        title: "Use Focused Packages For Internals",
        body: "The umbrella raw2d package stays app-friendly. Advanced renderer helpers live in focused packages such as raw2d-webgl and raw2d-canvas.",
        code: `// App-level code:
import { WebGLRenderer2D } from "raw2d";

// Engine/debug code:
import { createWebGLShapeBatch } from "raw2d-webgl";`
      },
      {
        title: "Object Option Names",
        body: "Constructor option names are treated as public API. Prefer explicit object creation instead of positional arguments.",
        code: `new Rect({ x: 40, y: 40, width: 120, height: 80 });
new Sprite({ texture, frame, width: 64, height: 64 });
new Text2D({ text: "Raw2D", x: 24, y: 48 });`
      },
      {
        title: "React Package Boundary",
        body: "raw2d-react is a bridge package. It should not change core object APIs, renderer APIs, or package boundaries.",
        code: `import { Raw2DCanvas, RawRect } from "raw2d-react";

// Core app code can still use raw2d directly.
import { Scene, Rect } from "raw2d";`
      },
      {
        title: "Release Checklist",
        body: "Before upgrading across pre-v1 releases, check release notes, run typecheck, open docs examples, and verify package imports.",
        code: `npm install raw2d@latest
npm run typecheck
npm run build`
      }
    ]
  }
];

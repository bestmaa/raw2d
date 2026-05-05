import type { DocTopic } from "./DocPage.type";

export const postReleaseAuditTopics: readonly DocTopic[] = [
  {
    id: "post-release-audit",
    label: "Post-Release Audit",
    title: "Post-Release Consumer Audit",
    description: "Verify Raw2D from the outside, exactly like a new npm user would install and run it.",
    sections: [
      {
        title: "Goal",
        body: "The audit proves that published packages, CDN files, docs snippets, examples, and Studio docs work without local workspace paths or hidden build assumptions.",
        code: `npm view raw2d version
npm view raw2d-core version
curl -I https://cdn.jsdelivr.net/npm/raw2d/dist/raw2d.js`
      },
      {
        title: "Fresh Install Matrix",
        body: "Test the umbrella package first, then focused packages, then optional packages. MCP and React stay separate from the browser runtime.",
        code: `npm install raw2d
npm install raw2d-core raw2d-canvas raw2d-webgl raw2d-sprite raw2d-text
npm install raw2d-mcp
npm install raw2d-react react react-dom`
      },
      {
        title: "Runtime Checks",
        body: "Each generated app must build and render one real scene. Canvas is the reference renderer; WebGL must also draw when the browser supports WebGL2. Studio docs and demo routes must load after publish.",
        code: `npm run build
npm run preview
# open Canvas, WebGL, Sprite, Texture Atlas, Interaction, and Studio demo routes`
      },
      {
        title: "Snippet Checks",
        body: "Docs and README snippets must compile from package imports. Do not allow snippets that rely on internal source paths.",
        code: `import { Scene, Camera2D } from "raw2d";
import { CanvasRenderer } from "raw2d-canvas";
import { WebGLRenderer2D } from "raw2d-webgl";`
      },
      {
        title: "Pass Criteria",
        body: "The audit passes only when install, build, browser render, npm metadata, CDN, docs routes, and Studio demo docs all work from the published package versions.",
        code: `npm run typecheck
npm run build:docs
npm run test:browser
npm run test:consumer
npm run test:cdn:pinned -- --live`
      }
    ]
  },
  {
    id: "post-release-audit-report",
    label: "Audit Report",
    title: "Post-Release Audit Report",
    description: "A short release-facing report template for npm, CDN, docs, and browser checks.",
    sections: [
      {
        title: "Current Result",
        body: "Use this report after a version is published. Fill the published version, npm metadata result, CDN result, docs result, and browser result before announcing the release.",
code: `Version: v1.1.x
npm package: pass / fail
CDN UMD: pass / fail
Docs route: pass / fail
Browser examples: pass / fail
Studio docs/demo: pass / fail`
      },
      {
        title: "NPM Checks",
        body: "Confirm the umbrella package and focused packages resolve from npm, then run fresh install smoke apps without workspace links.",
        code: `npm view raw2d version
npm view raw2d-core version
npm view raw2d-webgl version
npm install raw2d`
      },
      {
        title: "CDN Checks",
        body: "Check jsDelivr for ESM and UMD output. The CDN can lag npm briefly, so record the time if the package was just published.",
        code: `curl -I https://cdn.jsdelivr.net/npm/raw2d/dist/raw2d.js
curl -I https://cdn.jsdelivr.net/npm/raw2d/dist/raw2d.umd.cjs`
      },
      {
        title: "Browser Checks",
        body: "Open the docs, Studio, and examples in a real browser. Confirm Canvas, WebGL, Sprite, Texture Atlas, Interaction, React, and Studio demo routes do not show console errors.",
        code: `https://raw2d.com/doc
https://raw2d.com/studio
/doc#studio-demo-checklist
/readme#studio-demo-checklist
/examples/canvas-basic/
/examples/webgl-basic/
/examples/sprite-atlas/
/examples/interaction-basic/`
      },
      {
        title: "Report Decision",
        body: "Publish release notes only when all checks pass. If any check fails, keep the report with the failing command and fix before publishing again.",
        code: `Decision: pass
Release notes: ready
Next audit: after next version bump`
      }
    ]
  }
];

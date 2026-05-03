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
        body: "The audit proves that published packages, CDN files, docs snippets, and examples work without local workspace paths or hidden build assumptions.",
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
        body: "Each generated app must build and render one real scene. Canvas is the reference renderer; WebGL must also draw when the browser supports WebGL2.",
        code: `npm run build
npm run preview
# open Canvas, WebGL, Sprite, Texture Atlas, and Interaction examples`
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
        body: "The audit passes only when install, build, browser render, npm metadata, CDN, and docs routes all work from the published package versions.",
        code: `npm run typecheck
npm run build:docs
npm run test:browser
npm run test:consumer`
      }
    ]
  }
];

import type { DocTopic } from "./DocPage.type";

export const publicBetaTopics: readonly DocTopic[] = [
  {
    id: "public-beta-hardening",
    label: "Public Beta",
    title: "Public Beta Hardening",
    description: "Release gates for proving Raw2D works for new npm, CDN, docs, and browser users.",
    sections: [
      {
        title: "Goal",
        body: "Public beta work proves Raw2D can be installed, copied from docs, rendered in a browser, and released without hidden workspace assumptions.",
        code: `npm install raw2d
npm install raw2d-core raw2d-canvas
npm install raw2d-core raw2d-webgl
npm install raw2d-react react react-dom`
      },
      {
        title: "Fresh Install Gates",
        body: "Each fresh app must build and render one visible scene. Canvas, WebGL, and React checks stay separate so package boundaries remain clear.",
        code: `npm run build
npm run preview
# open the generated scene in a browser`
      },
      {
        title: "CDN Gates",
        body: "Use pinned jsDelivr URLs for release checks. Latest URLs are useful for users, but pinned URLs prove the exact release is available.",
        code: `curl -I https://cdn.jsdelivr.net/npm/raw2d@1.7.0/dist/raw2d.js
curl -I https://cdn.jsdelivr.net/npm/raw2d@1.7.0/dist/raw2d.umd.cjs`
      },
      {
        title: "Docs Gates",
        body: "Docs must load, search must find common terms, and snippets must use public package imports instead of source paths.",
        code: `https://raw2d.com/doc
https://raw2d.com/readme
Search: canvas, WebGL, sprite, React, MCP, Studio`
      },
      {
        title: "Pass/Fail Rule",
        body: "If any install, CDN, docs, browser, package, or release gate fails, keep the task open and record the failing command or route before fixing it.",
        code: `Decision: pass / fail
Failing route:
Failing command:
Fix commit:`
      }
    ]
  }
];

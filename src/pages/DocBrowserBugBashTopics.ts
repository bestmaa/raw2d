import type { DocTopic } from "./DocPage.type";

export const browserBugBashTopics: readonly DocTopic[] = [
  {
    id: "browser-bug-bash",
    label: "Browser Bug Bash",
    title: "Beta Browser Bug Bash",
    description: "Use this checklist before public beta releases to manually verify docs, examples, Studio, and CDN smoke routes.",
    sections: [
      {
        title: "Routes",
        body: "Open the main public beta routes directly. They should load without a blank screen, console errors, or missing asset errors.",
        code: `http://localhost:5174/doc
http://localhost:5174/readme
http://localhost:5174/examples/
http://localhost:5174/studio
http://localhost:5174/cdn-smoke
https://raw2d.com/doc
https://raw2d.com/readme
https://raw2d.com/examples/
https://raw2d.com/studio
https://raw2d.com/cdn-smoke`
      },
      {
        title: "Docs Navigation",
        body: "Search for Canvas, WebGL, Sprite, Interaction, React, and MCP. The active topic should change and the sidebar should stay scrollable.",
        code: `Search terms:
Canvas
WebGL
Sprite
Interaction
React
MCP`
      },
      {
        title: "Readme Navigation",
        body: "Switch between English and Hinglish readme docs, then open install, examples, CDN, and product snippet audit entries.",
        code: `Check:
/readme#v1-install
/readme#examples
/readme#cdn-beta-smoke
/readme#product-docs-snippet-audit`
      },
      {
        title: "Examples And Studio",
        body: "Open the examples index, core example routes, and the public Studio route. The Studio route should expose scope, tools, and panel links, while the separate Studio app smoke covers save, load, and export.",
        code: `Check:
/examples/
/examples/showcase/
/examples/interaction-basic/
/studio
npm run test:browser`
      },
      {
        title: "CDN Smoke",
        body: "Open the CDN smoke page before release, then verify pinned jsDelivr ESM and UMD URLs after the publish workflow finishes.",
        code: `Check:
/cdn-smoke
https://cdn.jsdelivr.net/npm/raw2d@1.15.3/dist/raw2d.js
https://cdn.jsdelivr.net/npm/raw2d@1.15.3/dist/raw2d.umd.cjs`
      },
      {
        title: "Pass Criteria",
        body: "The checklist passes only when docs content is readable, examples and Studio routes load, code blocks do not overflow badly, links route correctly, and no fatal browser console errors appear.",
        code: `npm run build:docs
npm run test:browser`
      }
    ]
  }
];

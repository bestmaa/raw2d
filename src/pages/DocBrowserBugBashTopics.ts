import type { DocTopic } from "./DocPage.type";

export const browserBugBashTopics: readonly DocTopic[] = [
  {
    id: "browser-bug-bash",
    label: "Browser Bug Bash",
    title: "Beta Browser Bug Bash",
    description: "Use this checklist before public beta releases to manually verify `/doc` and `/readme`.",
    sections: [
      {
        title: "Routes",
        body: "Open the main docs routes directly. Both should load without a blank screen, console errors, or missing asset errors.",
        code: `http://localhost:5174/doc
http://localhost:5174/readme
https://raw2d.com/doc
https://raw2d.com/readme`
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
        title: "Pass Criteria",
        body: "The checklist passes only when docs content is readable, code blocks do not overflow badly, links route correctly, and no fatal browser console errors appear.",
        code: `npm run build:docs
npm run test:browser`
      }
    ]
  }
];

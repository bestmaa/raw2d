import type { DocTopic } from "./DocPage.type";

export const cdnTopics: readonly DocTopic[] = [
  {
    id: "cdn-verification-checklist",
    label: "CDN Checklist",
    title: "jsDelivr CDN Verification Checklist",
    description: "Use this checklist after npm publish to confirm CDN consumers can load Raw2D.",
    sections: [
      {
        title: "Pinned Version URLs",
        body: "Always verify pinned version URLs first. They should return 200 and the expected JavaScript content type.",
        code: `curl -I https://cdn.jsdelivr.net/npm/raw2d@1.25.3/dist/raw2d.js
curl -I https://cdn.jsdelivr.net/npm/raw2d@1.25.3/dist/raw2d.umd.cjs
curl -I https://cdn.jsdelivr.net/npm/raw2d-core@1.25.3/dist/index.js
curl -I https://cdn.jsdelivr.net/npm/raw2d-canvas@1.25.3/dist/index.js
curl -I https://cdn.jsdelivr.net/npm/raw2d-webgl@1.25.3/dist/index.js`
      },
      {
        title: "Focused Package URLs",
        body: "The final package audit should cover every focused package CDN ESM entry, not only the umbrella package.",
        code: `raw2d-sprite
raw2d-text
raw2d-effects
raw2d-interaction
raw2d-mcp
raw2d-react
raw2d-react-fiber`
      },
      {
        title: "Latest URL",
        body: "Check the unpinned URL only after the pinned release works. jsDelivr latest can lag behind npm for a short time.",
        code: `curl -I https://cdn.jsdelivr.net/npm/raw2d/dist/raw2d.js
curl -I https://cdn.jsdelivr.net/npm/raw2d/dist/raw2d.umd.cjs`
      },
      {
        title: "Browser Import",
        body: "Load the ESM CDN build in a browser module script and create a tiny scene. This confirms the package works without bundler aliases.",
        code: `import { Scene, Camera2D, CanvasRenderer } from "https://cdn.jsdelivr.net/npm/raw2d@1.25.3/dist/raw2d.js";

const scene = new Scene();
const camera = new Camera2D();
const renderer = new CanvasRenderer({ canvas, width: 320, height: 180 });`
      },
      {
        title: "Raw2D Smoke Page",
        body: "Use the local CDN smoke page before release. Dry-run checks URL shape now; live mode should pass after npm publish.",
        code: `npm run test:cdn:pinned
npm run test:cdn:pinned -- --live
open /cdn-smoke`
      },
      {
        title: "Failure Checks",
        body: "If CDN is stale, verify npm version first, use a pinned URL, wait for jsDelivr cache refresh, and avoid announcing latest until it resolves.",
        code: `npm view raw2d version
https://www.jsdelivr.com/package/npm/raw2d`
      }
    ]
  }
];

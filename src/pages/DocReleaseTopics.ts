import type { DocTopic } from "./DocPage.type";

export const releaseTopics: readonly DocTopic[] = [
  {
    id: "v1-release-checklist",
    label: "v1 Release Checklist",
    title: "v1.0 Release Checklist",
    description: "Use this checklist before Raw2D is marked as v1 stable.",
    sections: [
      {
        title: "API Freeze",
        body: "Freeze package export maps, runtime exports, constructor option names, renderer lifecycle methods, and documented focused-package helpers.",
        code: `npm run typecheck
npm test
node --test tests/package/*.test.mjs`
      },
      {
        title: "Renderer Stability",
        body: "CanvasRenderer must remain the complete reference renderer. WebGLRenderer2D must clearly document supported objects, batching stats, and fallback behavior.",
        code: `npm run build:docs
npm run test:browser
npm run audit:bundle`
      },
      {
        title: "Docs And Examples",
        body: "Open docs, readme, benchmark, visual test, and every example route in a browser. Search and Hinglish mode should still work.",
        code: `http://localhost:5197/doc
http://localhost:5197/readme
http://localhost:5197/benchmark
http://localhost:5197/visual-test`
      },
      {
        title: "Package Metadata",
        body: "Every package must include README, LICENSE, NOTICE, TRADEMARKS, repository links, issue links, docs homepage, and npm keywords. The pack check runs npm pack in dry-run mode.",
        code: `node --test tests/package/metadata-audit.test.mjs
npm run pack:check -- --silent`
      },
      {
        title: "Release Publish",
        body: "For a release task, update release notes, tag the version, push main and tag, then verify GitHub Actions, npm, jsDelivr, and raw2d.com.",
        code: `git push origin main
git push origin v1.0.0
npm view raw2d version
curl -I https://cdn.jsdelivr.net/npm/raw2d@1.0.0/dist/raw2d.js
curl -I https://raw2d.com/doc`
      }
    ]
  }
];

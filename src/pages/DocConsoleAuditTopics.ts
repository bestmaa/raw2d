import type { DocTopic } from "./DocPage.type";

export const consoleAuditTopics: readonly DocTopic[] = [
  {
    id: "browser-console-audit",
    label: "Console Audit",
    title: "Browser Console Error Audit",
    description: "Use this checklist before docs, examples, or release verification are accepted.",
    sections: [
      {
        title: "Routes To Check",
        body: "Open the main docs pages and representative examples with DevTools console visible. Any uncaught error fails the audit.",
        code: `http://localhost:5197/doc
http://localhost:5197/readme
http://localhost:5197/benchmark
http://localhost:5197/visual-test
http://localhost:5197/examples/canvas-basic/
http://localhost:5197/examples/webgl-basic/
http://localhost:5197/examples/interaction-basic/`
      },
      {
        title: "What Fails",
        body: "Uncaught exceptions, failed module imports, missing assets, WebGL context crashes, and repeated noisy warnings must be fixed or explicitly documented.",
        code: `TypeError / ReferenceError
Failed to fetch dynamically imported module
404 asset request
WebGL context lost without recovery
Repeated warning loop`
      },
      {
        title: "Allowed Messages",
        body: "A clear one-time WebGL2 unavailable message is acceptable when the browser has no WebGL2 support. It should not hide missing renderer behavior.",
        code: `WebGL2 is not available.
Expected only on unsupported browsers.`
      },
      {
        title: "Automation",
        body: "Use the browser smoke test and visual pixel tests as automated guards, then still do one manual browser pass for release tasks.",
        code: `npm run test:browser
npm test
npm run build:docs`
      }
    ]
  }
];

import type { DocTopic } from "./DocPage.type";

export const publishTopics: readonly DocTopic[] = [
  {
    id: "npm-publish-checklist",
    label: "npm Publish Checklist",
    title: "npm Publish Verification Checklist",
    description: "Use this checklist only when a Raw2D release task explicitly requires publishing.",
    sections: [
      {
        title: "Before Publish",
        body: "Confirm the version was intentionally changed, release notes were updated, all package manifests agree on the same release version, and package readiness passed.",
        code: `npm run typecheck
npm test
npm run pack:check -- --silent
npm run audit:package
npm run test:consumer
git status --short`
      },
      {
        title: "GitHub Workflow",
        body: "Raw2D publishes through the GitHub workflow so local npm OTP is not required. Push the release commit and tag only after local verification passes.",
        code: `git tag vVERSION
git push origin main
git push origin vVERSION`
      },
      {
        title: "npm Verification",
        body: "After the workflow finishes, verify the umbrella package and every focused package from npm before announcing the release.",
        code: `npm view raw2d version
npm view raw2d-core version
npm view raw2d-canvas version
npm view raw2d-webgl version
npm view raw2d-sprite version
npm view raw2d-text version
npm view raw2d-effects version
npm view raw2d-interaction version
npm view raw2d-mcp version
npm view raw2d-react version
npm view raw2d-react-fiber version`
      },
      {
        title: "CDN And Consumer Check",
        body: "Run the consumer install checks and verify umbrella plus focused jsDelivr URLs once npm has the published version.",
        code: `npm run test:consumer
npm run test:cdn:pinned -- --live
curl -I https://cdn.jsdelivr.net/npm/raw2d@VERSION/dist/raw2d.js
curl -I https://cdn.jsdelivr.net/npm/raw2d-core@VERSION/dist/index.js
curl -I https://cdn.jsdelivr.net/npm/raw2d-canvas@VERSION/dist/index.js
curl -I https://cdn.jsdelivr.net/npm/raw2d-webgl@VERSION/dist/index.js`
      }
    ]
  }
];

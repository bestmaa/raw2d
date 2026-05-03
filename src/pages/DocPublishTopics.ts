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
        body: "Confirm the version was intentionally changed, release notes were updated, and all package manifests agree on the same release version.",
        code: `npm run typecheck
npm test
npm run pack:check -- --silent
git status --short`
      },
      {
        title: "GitHub Workflow",
        body: "Raw2D publishes through the GitHub workflow so local npm OTP is not required. Push the release commit and tag only after local verification passes.",
        code: `git tag v0.10.9
git push origin main
git push origin v0.10.9`
      },
      {
        title: "npm Verification",
        body: "After the workflow finishes, verify the umbrella package and focused packages from npm before announcing the release.",
        code: `npm view raw2d version
npm view raw2d-core version
npm view raw2d-canvas version
npm view raw2d-webgl version
npm view raw2d-react version`
      },
      {
        title: "Consumer Check",
        body: "Create a temporary consumer project or run the package import tests so the published package is known to install and build.",
        code: `node --test tests/package/import-consumer.test.mjs
curl -I https://cdn.jsdelivr.net/npm/raw2d@0.10.9/dist/raw2d.js`
      }
    ]
  }
];

import type { DocTopic } from "./DocPage.type";

export const packageReadinessTopics: readonly DocTopic[] = [
  {
    id: "package-readiness-audit",
    label: "Package Readiness",
    title: "Package Readiness Audit",
    description: "Final package size, tree-shaking, CDN, and fresh install audit before release.",
    sections: [
      {
        title: "Command",
        body: "Run the package readiness audit after building packages. It checks every public Raw2D package and the CDN-facing umbrella entry.",
        code: `npm run build
npm run audit:package`
      },
      {
        title: "Coverage",
        body: "The audit checks fixed versions, Raw2D dependency pins, sideEffects false, package files, tarball size, unpacked size, entry gzip size, CDN entry paths, and fresh install smoke scripts.",
        code: `raw2d-core
raw2d-canvas
raw2d-webgl
raw2d-sprite
raw2d-text
raw2d-effects
raw2d-interaction
raw2d-mcp
raw2d-react
raw2d-react-fiber
raw2d`
      },
      {
        title: "Pass Rule",
        body: "The audit must print issues: 0. If a package grows past its budget, reduce the entry size or raise the budget with a release note explaining why.",
        code: `Raw2D package readiness audit v1.25.2
issues: 0`
      }
    ]
  }
];

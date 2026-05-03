import type { DocTopic } from "./DocPage.type";

export const releaseNotesTopics: readonly DocTopic[] = [
  {
    id: "release-notes-template",
    label: "Release Notes Template",
    title: "Release Notes Template",
    description: "Use this template for Raw2D GitHub releases and npm release summaries.",
    sections: [
      {
        title: "Template",
        body: "Release notes should be short, specific, and grouped by user-facing impact. Include verification results before publishing.",
        code: `# Raw2D vVERSION

## Highlights
- 

## Added
- 

## Changed
- 

## Fixed
- 

## Verification
- npm run typecheck
- npm test
- npm run build:docs
- npm run test:browser`
      },
      {
        title: "Release Links",
        body: "Add links after the release is available. Keep npm, CDN, docs, and GitHub tag checks together.",
        code: `npm: https://www.npmjs.com/package/raw2d
CDN: https://cdn.jsdelivr.net/npm/raw2d@VERSION/dist/raw2d.js
Docs: https://raw2d.com/doc
Tag: https://github.com/bestmaa/raw2d/releases/tag/vVERSION`
      },
      {
        title: "Rules",
        body: "Do not claim unpublished work. Mention breaking changes clearly, and keep internal-only refactors out unless they affect users.",
        code: `Breaking changes:
- 

Known limits:
- 

Upgrade note:
- `
      }
    ]
  }
];

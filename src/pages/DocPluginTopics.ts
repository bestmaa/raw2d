import type { DocTopic } from "./DocPage.type";

export const pluginTopics: readonly DocTopic[] = [
  {
    id: "codex-plugin",
    label: "Codex Plugin",
    title: "Raw2D Codex Plugin",
    description: "Use the repo-local Raw2D plugin to scaffold examples, write docs, run QA, and inspect renderer diagnostics.",
    sections: [
      {
        title: "Purpose",
        body: "The plugin is for contributors and automation. It stays outside runtime npm packages so browser users do not pay for tooling code.",
        code: `plugins/raw2d/
  .codex-plugin/plugin.json
  skills/
  scripts/
  assets/`
      },
      {
        title: "Skills",
        body: "Skills describe repeatable Raw2D workflows for docs, feature building, visual checks, and package audits.",
        code: `raw2d-doc-writer
raw2d-feature-builder
raw2d-visual-check
raw2d-package-audit`
      },
      {
        title: "Commands",
        body: "Scripts are deterministic helpers. They print clear output and are safe to review before any release step.",
        code: `node plugins/raw2d/scripts/scaffold-raw2d-app.mjs --out ./demo --renderer webgl
node plugins/raw2d/scripts/create-raw2d-example.mjs --out ./examples/card --shape rect
node plugins/raw2d/scripts/run-docs-qa.mjs --json
node plugins/raw2d/scripts/run-visual-pixel-tests.mjs --dry-run --json
node plugins/raw2d/scripts/run-fresh-install-audit.mjs --dry-run --json
node plugins/raw2d/scripts/explain-renderer-stats.mjs --sample`
      },
      {
        title: "Test Workflow",
        body: "The plugin workflow builds Raw2D packages first, then runs plugin command and skill tests.",
        code: `npm ci
npm run build
node --test tests/plugin/*.test.mjs`
      },
      {
        title: "Release Boundary",
        body: "Plugin commands do not publish npm packages or push Git. Release tasks own versioning, tags, release notes, and publish verification.",
        code: `Allowed:
- scaffold files into explicit output paths
- run local QA commands
- explain diagnostics

Release-only:
- git push
- npm publish
- version tag creation`
      }
    ]
  }
];

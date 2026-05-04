# Raw2D Codex Plugin

The Raw2D Codex plugin is a repo-local contributor tool. It helps build examples, write docs, run visual checks, and audit packages without adding tooling code to browser runtime packages.

## Why It Exists

Raw2D is meant to be explicit and transparent. The plugin supports that direction by automating repeatable project tasks while keeping output visible and reviewable.

Use it for:

- feature docs and Hinglish docs
- isolated feature build workflows
- browser and visual verification
- package export audits
- app and example scaffolds
- renderer stats explanations

## Location

```txt
plugins/raw2d/
  .codex-plugin/plugin.json
  skills/
  scripts/
  assets/
```

The plugin is outside `packages/*`. It should not be published inside `raw2d`, `raw2d-core`, `raw2d-canvas`, or `raw2d-webgl`.

## Skills

- `raw2d-doc-writer`: writes docs, examples, and Hinglish guidance.
- `raw2d-feature-builder`: builds one isolated feature with tests and docs.
- `raw2d-visual-check`: verifies browser pages and visual pixel tests.
- `raw2d-package-audit`: checks package exports, versions, pack output, and release readiness.

## Commands

```bash
node plugins/raw2d/scripts/scaffold-raw2d-app.mjs --out ./demo --renderer webgl
node plugins/raw2d/scripts/create-raw2d-example.mjs --out ./examples/card --shape rect
node plugins/raw2d/scripts/create-raw2d-showcase.mjs --out ./demo-showcase --renderer webgl
node plugins/raw2d/scripts/run-docs-qa.mjs --json
node plugins/raw2d/scripts/run-visual-pixel-tests.mjs --dry-run --json
node plugins/raw2d/scripts/run-fresh-install-audit.mjs --dry-run --json
node plugins/raw2d/scripts/explain-renderer-stats.mjs --sample
```

## Test Workflow

The plugin workflow builds Raw2D packages before running plugin tests:

```bash
npm ci
npm run build
node --test tests/plugin/*.test.mjs
```

## Boundaries

- Plugin commands do not publish npm packages.
- Plugin commands do not push Git.
- Generated files must go to explicit output paths.
- Release tasks own version bumps, tags, release notes, publish workflow checks, npm verification, and CDN verification.

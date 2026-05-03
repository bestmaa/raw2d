# Raw2D Codex Plugin

Raw2D Codex plugin repo-local contributor tool hai. Ye examples banane, docs likhne, visual checks chalane aur packages audit karne me help karta hai, lekin browser runtime packages me tooling code add nahi karta.

## Ye Kyun Hai

Raw2D ka direction explicit aur transparent engine banana hai. Plugin repeat hone wale project tasks automate karta hai, par output hamesha visible aur reviewable rakhta hai.

Isko use karein:

- feature docs aur Hinglish docs ke liye
- isolated feature build workflow ke liye
- browser aur visual verification ke liye
- package export audit ke liye
- app aur example scaffold ke liye
- renderer stats explain karne ke liye

## Location

```txt
plugins/raw2d/
  .codex-plugin/plugin.json
  skills/
  scripts/
  assets/
```

Plugin `packages/*` ke bahar hai. Isko `raw2d`, `raw2d-core`, `raw2d-canvas`, ya `raw2d-webgl` runtime package ke andar publish nahi karna hai.

## Skills

- `raw2d-doc-writer`: docs, examples aur Hinglish guidance likhta hai.
- `raw2d-feature-builder`: ek isolated feature tests aur docs ke saath banata hai.
- `raw2d-visual-check`: browser pages aur visual pixel tests verify karta hai.
- `raw2d-package-audit`: package exports, versions, pack output aur release readiness check karta hai.

## Commands

```bash
node plugins/raw2d/scripts/scaffold-raw2d-app.mjs --out ./demo --renderer webgl
node plugins/raw2d/scripts/create-raw2d-example.mjs --out ./examples/card --shape rect
node plugins/raw2d/scripts/run-docs-qa.mjs --json
node plugins/raw2d/scripts/run-visual-pixel-tests.mjs --dry-run --json
node plugins/raw2d/scripts/explain-renderer-stats.mjs --sample
```

## Test Workflow

Plugin workflow pehle Raw2D packages build karta hai, phir plugin tests chalata hai:

```bash
npm ci
npm run build
node --test tests/plugin/*.test.mjs
```

## Boundaries

- Plugin commands npm packages publish nahi karte.
- Plugin commands Git push nahi karte.
- Generated files explicit output path me hi jate hain.
- Release tasks version bump, tags, release notes, publish workflow checks, npm verification aur CDN verification own karte hain.


---
name: raw2d-feature-builder
description: Build or modify a Raw2D feature in the engine, renderer, interaction, sprite, text, WebGL, MCP, or plugin packages. Use when Codex needs to implement isolated TypeScript code with matching type files, tests, docs, examples, browser verification, and package-boundary checks.
---

# Raw2D Feature Builder

Use this skill to implement one focused Raw2D feature end to end.

## Workflow

1. Read `AGENTS.md`, `task.md`, nearby source files, type files, tests, and docs.
2. Identify the owning package and keep dependency direction unchanged.
3. Design the smallest public API change that fits existing naming.
4. Add or update `*.type.ts` beside each feature file.
5. Keep objects as data/scene-graph classes; keep Canvas/WebGL drawing inside renderer packages.
6. Add focused unit tests before broad docs work.
7. Add docs and examples only for the changed behavior.
8. Generate a focused example or showcase scene when the behavior needs a practical browser demo.
9. Run focused tests, full checks, and browser checks when examples or docs changed.

## Code Rules

- Use strict TypeScript and avoid `any`.
- Keep every file under 250 lines.
- Prefer `readonly` and explicit public return types.
- Use barrel exports only where that package already exposes public API.
- Do not add physics, WASM, ECS, or unrelated abstractions.
- Do not copy PixiJS, Phaser, or Three.js APIs; keep Raw2D explicit and transparent.

## Renderer Rules

- Canvas support should work first when a feature is drawable.
- WebGL support should preserve the pipeline: Scene -> RenderList -> Batcher -> Buffer -> Shader -> DrawCall.
- If WebGL cannot fully support a feature, add a clear fallback, diagnostic, or documented unsupported path.
- Keep batching code split into small helpers.

## Verification

Run focused checks first:

```bash
npm run typecheck
npm test -- --test-name-pattern="<feature>"
```

Run the full gate before commit:

```bash
npm run typecheck
npm test
npm run build:docs
npm run pack:check -- --silent
npm run test:consumer
git diff --check
```

For example-heavy changes, verify generated demos:

```bash
node plugins/raw2d/scripts/create-raw2d-example.mjs --out /tmp/raw2d-example --renderer canvas --shape rect
node plugins/raw2d/scripts/create-raw2d-showcase.mjs --out /tmp/raw2d-showcase --renderer webgl
```

For visual features, open the relevant docs/example route and confirm the rendered output matches the docs.

## Summary

Report the feature added, files changed, public API names, tests run, docs/examples touched, and any unsupported renderer behavior.

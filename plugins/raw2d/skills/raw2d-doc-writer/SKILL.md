---
name: raw2d-doc-writer
description: Write or update Raw2D documentation for a feature, API, package, renderer behavior, example, or release note. Use when Codex needs to add docs/readme coverage, English plus Hinglish guidance, runnable examples, parameter tables, live-demo notes, or verification steps for Raw2D.
---

# Raw2D Doc Writer

Use this skill to document one Raw2D feature clearly without changing unrelated engine code.

## Workflow

1. Identify the feature owner package and public API names.
2. Read the implementation, type file, tests, and current docs for that feature.
3. Write docs for why the feature exists, when to use it, and how it fits Raw2D's transparent pipeline.
4. Include a small example and a full example when the feature can be demonstrated.
5. Add or update Hinglish docs when an English docs file exists.
6. Verify docs build, examples compile, and browser examples still load.

## Content Rules

- Keep docs practical and beginner-readable.
- Prefer Raw2D package imports such as `raw2d`, `raw2d-canvas`, `raw2d-webgl`, or focused package names.
- Explain Canvas and WebGL behavior separately when they differ.
- Document key constructor fields, method arguments, defaults, and return values.
- Include performance notes only when they are concrete and already supported by code.
- Keep examples isolated and avoid global type dumps.

## Hinglish Rules

- Write natural Hinglish, not word-by-word translation.
- Keep API names, class names, package names, and code comments in English.
- Explain the purpose in simple Hindi/Hinglish sentences.
- Avoid mixed phrases like "Why Use karein it"; write "Isko kab use karein" instead.

## Verification

Run focused checks first, then full checks when package versions or docs navigation changed:

```bash
npm run typecheck
npm test
npm run build:docs
```

For browser-facing docs, open the relevant `/doc#...`, `/readme#...`, or example page and confirm the page renders, examples match the text, and controls are usable.

## Output Summary

Report:

- docs files changed
- examples added or updated
- tests/build commands run
- browser page checked
- remaining doc gaps, if any


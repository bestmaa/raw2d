# Raw2D Plugin Scripts

Deterministic helper scripts will live here. Scripts should print clear output and should avoid hidden file writes.

Available scripts:

- app scaffold command
- example generator command
- docs QA command
- visual pixel test command
- fresh install audit command
- renderer stats explanation command

## App Scaffold

```bash
node plugins/raw2d/scripts/scaffold-raw2d-app.mjs --out ./my-raw2d-app --renderer webgl
```

Use `--renderer canvas` for a Canvas-only starter or `--renderer webgl` for WebGL with Canvas fallback.

## Example Generator

```bash
node plugins/raw2d/scripts/create-raw2d-example.mjs --out ./examples/my-example --renderer canvas --shape rect
```

Use `--shape rect`, `--shape circle`, or `--shape text` for a small focused example.

## Docs QA

```bash
node plugins/raw2d/scripts/run-docs-qa.mjs --json
```

Checks English/Hinglish doc pairs, TODO placeholders, and required public docs files.

## Visual Pixel Tests

```bash
node plugins/raw2d/scripts/run-visual-pixel-tests.mjs --dry-run --json
node plugins/raw2d/scripts/run-visual-pixel-tests.mjs
```

Runs the deterministic WebGL visual regression test entry.

## Fresh Install Audit

```bash
node plugins/raw2d/scripts/run-fresh-install-audit.mjs --dry-run --json
node plugins/raw2d/scripts/run-fresh-install-audit.mjs
```

Runs package dry pack checks and fresh consumer install smoke tests.

## Renderer Stats Explanation

```bash
node plugins/raw2d/scripts/explain-renderer-stats.mjs --sample
node plugins/raw2d/scripts/explain-renderer-stats.mjs --input '{"renderer":"WebGLRenderer2D","objects":280,"drawCalls":4}'
```

Explains Raw2D renderer diagnostics in practical batching and performance terms.

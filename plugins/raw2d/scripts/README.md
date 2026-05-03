# Raw2D Plugin Scripts

Deterministic helper scripts will live here. Scripts should print clear output and should avoid hidden file writes.

Available scripts:

- app scaffold command
- example generator command

Planned scripts:

- docs QA command
- visual pixel test command
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

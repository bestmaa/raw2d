# Raw2D Plugin Scripts

Deterministic helper scripts will live here. Scripts should print clear output and should avoid hidden file writes.

Available scripts:

- app scaffold command

Planned scripts:

- example generator command
- docs QA command
- visual pixel test command
- renderer stats explanation command

## App Scaffold

```bash
node plugins/raw2d/scripts/scaffold-raw2d-app.mjs --out ./my-raw2d-app --renderer webgl
```

Use `--renderer canvas` for a Canvas-only starter or `--renderer webgl` for WebGL with Canvas fallback.

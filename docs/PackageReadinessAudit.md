# Package Readiness Audit

Use this audit before a release candidate or public publish.

## Command

```sh
npm run build
npm run audit:package
```

The audit checks every public package:

- fixed package version and Raw2D dependency pins
- `sideEffects: false` for tree-shaking
- package files, tarball size, unpacked size, and entry file gzip size
- CDN-facing `raw2d` ESM and UMD entry paths
- fresh install smoke scripts for umbrella, focused, Canvas, WebGL, MCP, and React

## Pass Rule

The command must print `issues: 0`. If a package grows past its budget, either
reduce the entry size or raise the budget with a release note explaining why.

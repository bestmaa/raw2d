# Package Readiness Audit

Release candidate ya public publish se pehle ye audit run karein.

## Command

```sh
npm run build
npm run audit:package
```

Ye audit har public package check karta hai:

- fixed package version aur Raw2D dependency pins
- tree-shaking ke liye `sideEffects: false`
- package files, tarball size, unpacked size, aur entry file gzip size
- CDN ke liye `raw2d` ESM aur UMD entry paths
- umbrella, focused, Canvas, WebGL, MCP, aur React fresh install smoke scripts

## Pass Rule

Command ko `issues: 0` print karna chahiye. Agar package budget se bada ho jaye,
to entry size reduce karein ya release note ke saath budget update karein.

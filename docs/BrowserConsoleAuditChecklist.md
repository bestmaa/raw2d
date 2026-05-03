# Browser Console Error Audit

Use this checklist before docs, examples, or release verification are accepted.

## Routes

- Open `/doc`.
- Open `/readme`.
- Open `/benchmark`.
- Open `/visual-test`.
- Open `/examples/canvas-basic/`.
- Open `/examples/webgl-basic/`.
- Open `/examples/interaction-basic/`.

## Failing Console Output

- Uncaught `TypeError` or `ReferenceError`.
- Failed dynamic module imports.
- 404 asset requests.
- WebGL context loss without recovery.
- Repeated warning loops.
- Missing texture or font loading errors.

## Allowed Console Output

A single clear WebGL2 unavailable message is acceptable on unsupported browsers.
It must not hide a broken WebGL example.

## Verification

Run `npm run test:browser`, `npm test`, and `npm run build:docs`. For release
tasks, also do one manual browser pass with DevTools open.

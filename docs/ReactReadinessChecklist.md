# Final React Package Readiness Checklist

Use this checklist before presenting `raw2d-react` as ready for early users.

## Package Boundary

- `raw2d-react` is an adapter package.
- React must not move into `raw2d-core`.
- React must not move into `raw2d-canvas`.
- React must not move into `raw2d-webgl`.
- React must not move into sprite, text, or effects packages.

## Consumer Build

```sh
npm run build --workspace raw2d-react
node --test tests/react/*.test.mjs
```

The consumer app should build with Vite and React. JSX primitives should map to
Raw2D objects without hiding the renderer pipeline.

## Docs

- React docs should say the package is optional.
- React docs should say the package is early.
- React docs should explain the runtime boundary.
- `/examples/react-basic/` should load in the browser.

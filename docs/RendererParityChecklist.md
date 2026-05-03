# Final Renderer Parity Checklist

Use this checklist before claiming Canvas and WebGL behavior is release-ready.

## Shared Behavior

CanvasRenderer and WebGLRenderer2D should agree on:

- Scene traversal.
- `object.visible`.
- Position, rotation, scale, and origin.
- zIndex render order.
- Camera x/y/zoom.
- Material color basics.

## Known Differences

- Canvas is the reference renderer.
- WebGL is the batched renderer.
- WebGL may use texture fallback for unsupported ShapePath fills.
- WebGL2 unavailable messaging must be clear.
- Renderer stats may exist only where the renderer supports them.

## Checks

```sh
npm run test:browser
node --test tests/renderers/*.test.mjs
```

Also open `/benchmark` and `/visual-test` in a browser before release.

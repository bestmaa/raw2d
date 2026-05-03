# WebGL Docs Visual QA Checklist

Use this checklist before a WebGL docs or example change is accepted.

## Routes

- Open `/doc#webgl-renderer`.
- Open `/doc#webgl-performance`.
- Open `/doc#webgl-visual-tests`.
- Open `/benchmark`.
- Open `/visual-test`.
- Open `/examples/webgl-basic/`.

## Visual Result

- WebGL canvas must not be blank.
- Supported shapes, sprites, text textures, and path fallback output must be visible.
- Colors, zIndex order, and texture frames should match the example code.
- Canvas comparison is required only when both renderers support the same feature.

## Diagnostics

- Check drawCalls.
- Check textureBinds.
- Check static cache hits and misses.
- Check unsupportedObjects.
- Check that WebGL2 unavailable messaging is clear.

## Browser Check

Use a real browser before committing. Reload the route, resize the viewport,
watch for console errors, and confirm WebGL stats still update.

# Final Renderer Parity Checklist

Canvas aur WebGL behavior release-ready bolne se pehle ye checklist use karo.

## Shared Behavior

CanvasRenderer aur WebGLRenderer2D in behavior par agree karne chahiye:

- Scene traversal.
- `object.visible`.
- Position, rotation, scale, aur origin.
- zIndex render order.
- Camera x/y/zoom.
- Material color basics.

## Known Differences

- Canvas reference renderer hai.
- WebGL batched renderer hai.
- WebGL unsupported ShapePath fills ke liye texture fallback use kar sakta hai.
- WebGL2 unavailable messaging clear hona chahiye.
- Renderer stats wahi honge jahan renderer support karta hai.

## Checks

```sh
npm run test:browser
node --test tests/renderers/*.test.mjs
```

Release se pehle browser me `/benchmark` aur `/visual-test` bhi open karo.

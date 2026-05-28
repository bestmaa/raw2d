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

## Browser Matrix

`/visual-test` page ko `window.__raw2dPixelResult.matrix` expose karna chahiye
jisme public support-matrix ke har object ke liye ek row ho:

- `Rect`, `Circle`, `Ellipse`, `Arc`, `Line`, `Polyline`, aur `Polygon`.
- `ShapePath`, WebGL rasterized fill fallback ke saath.
- `Sprite` aur `Text2D` texture paths.
- `Group2D` flattened child rendering.

Har row Canvas aur WebGL dono se render honi chahiye, status, hash, aur colored
pixel count report kare, aur agar koi renderer sirf background pixels draw kare
to browser test fail hona chahiye.

## Known Differences

- Canvas reference renderer hai.
- WebGL batched renderer hai.
- WebGL unsupported ShapePath fills ke liye texture fallback use kar sakta hai.
- WebGL2 unavailable messaging clear hona chahiye.
- Renderer stats wahi honge jahan renderer support karta hai.

## Checks

```sh
npm run test:browser
node --test tests/browser/visual-pixel.test.mjs
```

Release se pehle browser me `/benchmark` aur `/visual-test` bhi open karo.

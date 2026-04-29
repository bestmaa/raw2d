# ShapePath

ShapePath custom 2D path commands ke liye hai. Jab Rect, Circle, Line, Polyline, ya Polygon se shape express nahi hoti, tab ShapePath use hota hai.

## Iska Kaam

ShapePath sirf path data rakhta hai. Canvas native path commands se fill/stroke karta hai. WebGL path ko flattened points me convert karke stroke aur simple closed fill render karta hai.

WebGL me complex fill rules abhi intentionally skip hote hain, taaki galat output na aaye.

## Kab Use Karein

Jab custom icon, editor shape, curve, ya low-level vector shape banana ho, tab ShapePath use karein. Agar exact Canvas-style fill behavior chahiye, Canvas renderer safest path hai.

## WebGL Fill Safety

WebGL abhi sirf ek simple closed subpath ko fill karta hai.

```ts
console.log(webglRenderer.getStats().shapePathUnsupportedFills);
```

Ye count badhta hai jab ShapePath fill me multiple subpaths, hole-style path, degenerate polygon, ya self-intersection ho. Aise case me WebGL fill skip karta hai, lekin stroke enabled ho to stroke render ho sakta hai.

Development me ye skip visibly pakadna ho to fallback warning mode use karo:

```ts
const webglRenderer = new WebGLRenderer2D({
  canvas: canvasElement,
  shapePathFillFallback: "warn",
  onShapePathFillFallback: (fallback) => {
    console.warn(fallback.reason);
  }
});
```

## Important Notes

- Objects data aur behavior rakhte hain; drawing renderer ka kaam hai.
- Canvas stable reference renderer hai.
- WebGL batch-first performance path hai.
- Code examples me API names English me hi rakhe gaye hain.

## English Reference

Detailed English version: `docs/ShapePath.md`

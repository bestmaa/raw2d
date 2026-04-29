# BasicMaterial

BasicMaterial fill aur stroke style data rakhta hai. Objects is material ko store karte hain; drawing Canvas ya WebGL renderer karta hai.

## Iska Kaam

Isme `fillColor`, `strokeColor`, `lineWidth`, `strokeCap`, `strokeJoin`, aur `miterLimit` jaise values hoti hain. Line, Polyline, open Arc, ShapePath stroke, aur Text2D stroke/fill renderer in values ko read karte hain.

## Kab Use Karein

```ts
const material = new BasicMaterial({
  strokeColor: "#facc15",
  lineWidth: 6,
  strokeCap: "round",
  strokeJoin: "round",
  miterLimit: 8
});
```

`strokeCap` line ke start/end ko control karta hai: `butt`, `round`, ya `square`.
`strokeJoin` corners ko control karta hai: `miter`, `round`, ya `bevel`.
`miterLimit` sharp corner ko limit karta hai; limit cross ho to WebGL bevel join use karta hai.

## Important Notes

- Objects data aur behavior rakhte hain; drawing renderer ka kaam hai.
- Canvas stable reference renderer hai.
- WebGL batch-first performance path hai.
- Code examples me API names English me hi rakhe gaye hain.

## English Reference

Detailed English version: `docs/BasicMaterial.md`

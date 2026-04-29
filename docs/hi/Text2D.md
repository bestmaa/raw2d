# Text2D

`Text2D` text object ka data rakhta hai. Object khud draw nahi karta; Canvas ya WebGL renderer is data ko read karke draw karta hai.

## Iska Kaam

Canvas renderer text ko directly Canvas API se draw karta hai. WebGLRenderer2D text ko pehle chhote canvas texture me rasterize karta hai, fir Sprite jaisa texture quad draw karta hai.

## Kab Use Karein

```ts
const label = new Text2D({
  x: 80,
  y: 135,
  text: "Hello Raw2D",
  font: "32px sans-serif",
  material: new BasicMaterial({
    fillColor: "#f5f7fb",
    strokeColor: "#10141c",
    lineWidth: 3
  })
});
```

`strokeColor` agar `fillColor` se alag hai to stroke draw hota hai. Text, font, fill color, stroke color, ya line width change karne par WebGL text texture rebuild hota hai. Position, rotation, ya scale change karne par same texture reuse hota hai.

## Important Notes

- Objects data aur behavior rakhte hain; drawing renderer ka kaam hai.
- Canvas stable reference renderer hai.
- WebGL batch-first performance path hai.
- Code examples me API names English me hi rakhe gaye hain.

## English Reference

Detailed English version: `docs/Text2D.md`

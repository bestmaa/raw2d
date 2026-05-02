# WebGL Visual Tests

Raw2D me quick browser pixel check ke liye ek simple page hai:

```text
http://localhost:5174/visual-test
```

Ye page same scene ko Canvas aur WebGL dono se render karta hai, phir result expose karta hai:

- `status`
- `hash`
- `coloredPixels`
- `width`
- `height`

Browser console me read karein:

```ts
console.log(window.__raw2dPixelResult);
```

Iska use real browser pixel smoke test ke liye karein. Unit tests WebGL geometry snapshots lock karte hain, aur ye page blank canvas, sirf background output, context, color, shader, ya viewport issue pakadne me help karta hai.

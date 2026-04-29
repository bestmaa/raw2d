# Renderer Parity

Renderer parity batata hai ki Canvas aur WebGL renderer abhi kaun se Raw2D objects support karte hain.

Canvas complete reference renderer hai. WebGL batch-first performance renderer hai, isliye kuch features partial ho sakte hain.

## Global Matrix

```ts
import { getRendererSupportMatrix } from "raw2d";

console.table(getRendererSupportMatrix());
```

Har row me ye fields hote hain:

- `kind`: object name
- `canvas`: Canvas support level
- `webgl`: WebGL support level
- `note`: short implementation detail

## Active Renderer Support

Renderer instance se direct support profile read kar sakte ho:

```ts
const support = renderer.getSupport();

console.log(support.renderer);
console.log(support.objects.Rect);
console.log(support.objects.ShapePath);
console.log(support.notes.ShapePath);
```

Ye editor UI, docs, debug tools, aur future React wrapper ke liye useful hai.

## Support Levels

- `supported`: normal render expected hai
- `partial`: feature kaam karta hai, par known limitation hai
- `unsupported`: renderer intentionally skip karta hai

## English Reference

Detailed English version: `docs/RendererParity.md`

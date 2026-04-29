# Renderer Parity

Renderer parity batata hai ki Canvas aur WebGL renderer abhi kaun se Raw2D objects support karte hain.

Canvas complete reference renderer hai. WebGL batch-first performance renderer hai, isliye kuch features partial ho sakte hain.

## Global Matrix

Current checklist:

| Object | Canvas | WebGL | Priority | Note |
| --- | --- | --- | --- | --- |
| Rect | supported | supported | done | Filled shape geometry batch hoti hai. |
| Circle | supported | supported | done | WebGL triangle approximation use karta hai. |
| Ellipse | supported | supported | done | WebGL triangle approximation use karta hai. |
| Arc | supported | supported | done | Open arc stroke geometry, closed arc fan geometry banata hai. |
| Line | supported | supported | done | WebGL stroked line geometry likhta hai. |
| Polyline | supported | supported | done | Segments stroke geometry me expand hote hain. |
| Polygon | supported | supported | done | Simple polygons ear clipping se triangulate hote hain. |
| ShapePath | supported | partial | medium | Stroke aur simple closed fill work karta hai; complex fill rasterize fallback use kar sakta hai. |
| Text2D | supported | partial | medium | Fill aur optional stroke text cached texture me rasterize hota hai; glyph atlas abhi nahi hai. |
| Sprite | supported | supported | done | Same-texture consecutive sprites batch ho sakte hain. |
| Group2D | supported | supported | done | Groups `RenderPipeline` se flatten hote hain. |

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

## Missing Support Plan

1. Text2D cache maturity: current cache fill/stroke text textures handle karta hai; next step glyph atlas ya better pooling hai.
2. Stroke polish: caps aur joins ab material se control hote hain; next polish curve sampling controls aur visual tests hain.
3. ShapePath direct GPU fill: rasterized fallback stable hone ke baad direct fill rules expand karna.
4. Performance proof: Canvas/WebGL comparison demos aur stats ko updated rakhna.

Canvas correctness baseline rahega. WebGL sirf wahi draw kare jiska output predictable ho; warna skip, warn, ya explicit fallback use kare.

## English Reference

Detailed English version: `docs/RendererParity.md`

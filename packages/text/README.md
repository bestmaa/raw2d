# raw2d-text

Text object and text bounds helpers for Raw2D.

`Text2D` stores text data, transform state, and material style. Renderers decide how to draw or cache it.

```bash
npm install raw2d-text raw2d-core
```

```ts
import { BasicMaterial } from "raw2d-core";
import { Text2D } from "raw2d-text";

const label = new Text2D({
  text: "Raw2D",
  x: 40,
  y: 80,
  fontSize: 32,
  material: new BasicMaterial({ fillColor: "#ffffff" })
});
```

Use this focused package when you need text objects without importing every Raw2D module.

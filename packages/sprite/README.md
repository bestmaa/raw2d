# raw2d-sprite

Sprite and texture package for Raw2D.

```ts
import { Sprite, TextureLoader } from "raw2d-sprite";

const texture = await new TextureLoader().load("/sprite.png");
const sprite = new Sprite({ x: 120, y: 80, texture });
```

`Sprite` stores data. Renderer packages decide how to draw it.

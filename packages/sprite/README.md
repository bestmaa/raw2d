# raw2d-sprite

Sprite and texture package for Raw2D.

This package contains data objects only:

- `Texture`
- `TextureLoader`
- `TextureAtlas`
- `Sprite`
- Sprite bounds helpers

Rendering stays in `raw2d-canvas` and `raw2d-webgl`.

## TextureAtlas

`TextureAtlas` stores named rectangles inside one `Texture`.

```ts
import { Sprite, Texture, TextureAtlas } from "raw2d-sprite";

const texture = new Texture({
  source: imageElement,
  width: imageElement.naturalWidth,
  height: imageElement.naturalHeight
});

const atlas = new TextureAtlas({
  texture,
  frames: {
    idle: { x: 0, y: 0, width: 32, height: 32 },
    run: { x: 32, y: 0, width: 32, height: 32 }
  }
});

const sprite = new Sprite({
  texture: atlas.texture,
  frame: atlas.getFrame("idle")
});
```

The atlas is intentionally simple for now. It does not pack images automatically. It gives Canvas a source rectangle and gives WebGL frame UVs for future larger sprite batches.

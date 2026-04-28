# TextureAtlas

`TextureAtlas` maps named frames to rectangles inside one `Texture`.

Use it when several sprites come from the same image sheet. The Sprite still stores only data. Canvas and WebGL decide how to draw the selected frame.

## Create Atlas

```ts
import { Texture, TextureAtlas } from "raw2d";

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
```

The current atlas is explicit. It does not pack images automatically yet.

You can also load the same structure from JSON:

```ts
const atlas = await new TextureAtlasLoader({ cache: true }).load("/sprites/player.atlas.json");
```

## Use Frame With Sprite

```ts
import { Camera2D, Canvas, Scene, Sprite } from "raw2d";

const scene = new Scene();
const camera = new Camera2D();

const sprite = new Sprite({
  texture: atlas.texture,
  frame: atlas.getFrame("idle"),
  x: 120,
  y: 80
});

scene.add(sprite);
raw2dCanvas.render(scene, camera);
```

If `width` and `height` are not passed, Sprite uses the frame size.

## Switch Frame

```ts
sprite.setFrame(atlas.getFrame("run"));
raw2dCanvas.render(scene, camera);
```

This changes which source rectangle is drawn. It does not create a new Texture.

## Why It Matters

Canvas uses the frame as a source rectangle:

```ts
context.drawImage(source, sx, sy, sw, sh, dx, dy, dw, dh);
```

WebGL converts the same frame into UV coordinates. Sprites using the same `atlas.texture` can be grouped into the same texture batch when they are consecutive in render order.

This is the foundation for a future automatic texture atlas packer.

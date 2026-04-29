# TextureAtlas

TextureAtlas ek hi image ke andar multiple sprite frames ka map hota hai. Ye game sprites, icons, UI pieces, aur animation frames ke liye useful hai.

Simple language me: ek badi image, uske andar named rectangles.

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

## Sprite Me Frame Use Karna

```ts
import { Camera2D, Canvas, Scene, Sprite } from "raw2d";

const scene = new Scene();
const camera = new Camera2D();
const raw2dCanvas = new Canvas({ canvas: canvasElement });

const sprite = new Sprite({
  texture: atlas.texture,
  frame: atlas.getFrame("idle"),
  x: 120,
  y: 80
});

scene.add(sprite);
raw2dCanvas.render(scene, camera);
```

## Frame Change

```ts
sprite.setFrame(atlas.getFrame("run"));
raw2dCanvas.render(scene, camera);
```

Frame change karne se new texture nahi banta. Sirf source rectangle change hota hai.

## WebGL Me Kyu Useful Hai

WebGL me texture bind expensive ho sakta hai. Agar sprites same atlas texture use karte hain, to renderer unhe ek texture batch me rakh sakta hai.

```text
many images -> many texture binds
one atlas   -> fewer texture binds
```

## English Reference

Detailed English version: `docs/TextureAtlas.md`

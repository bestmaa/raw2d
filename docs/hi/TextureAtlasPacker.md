# TextureAtlasPacker

`TextureAtlasPacker` alag-alag image sources ko ek generated canvas texture me pack karta hai, aur us texture ke liye `TextureAtlas` return karta hai.

Iska use tab karein jab bahut saare chhote sprites ek hi WebGL texture share karna chahte hain.

## Basic Usage

```ts
const atlas = new TextureAtlasPacker({
  padding: 2,
  edgeBleed: 1,
  maxWidth: 1024,
  maxHeight: 1024,
  powerOfTwo: true,
  sort: "area"
}).pack([
  { name: "idle", source: idleImage },
  { name: "run", source: runImage },
  { name: "jump", source: jumpImage }
]);
```

Returned atlas ke andar ek generated texture hota hai. Har frame us texture ke andar ek rectangle point karta hai.

`edgeBleed` frame ke edge pixels ko padding me copy karta hai. Isse WebGL linear filtering me frame edge par seams kam hote hain.

## Packing Stats

Atlas ke saath diagnostics chahiye ho to `packWithStats()` use karein:

```ts
const result = new TextureAtlasPacker({
  padding: 2,
  maxWidth: 1024,
  sort: "area"
}).packWithStats(items);

console.log(result.stats.frameCount);
console.log(result.stats.width, result.stats.height);
console.log(result.stats.usedArea);
console.log(result.stats.wastedArea);
console.log(result.stats.occupancy);

const atlas = result.atlas;
```

`occupancy` ka matlab hai `usedArea / totalArea`. Ye value jitni high hogi, atlas me empty space utna kam hoga.

## WebGL Batching

Packed atlas sprites same `atlas.texture` share karte hain:

```ts
scene.add(new Sprite({
  texture: atlas.texture,
  frame: atlas.getFrame("idle")
}));

scene.add(new Sprite({
  texture: atlas.texture,
  frame: atlas.getFrame("run")
}));

webglRenderer.render(scene, camera);
console.log(webglRenderer.getStats().textureBinds);
// 1
```

Separate images normally separate textures banate hain. Packed atlas texture binds kam kar sakta hai.

## Options

- `padding`: frames ke beech empty pixels
- `edgeBleed`: frame edge ko padding me copy karna
- `maxWidth`: row wrap hone se pehle maximum atlas width
- `maxHeight`: maximum atlas height
- `powerOfTwo`: output canvas ko power-of-two size tak grow karna
- `sort`: `none`, `height`, ya `area`
- `createCanvas`: tests ya custom runtime ke liye canvas factory

## Current Scope

Packer abhi readable row layout use karta hai. `sort: "area"` mixed-size sprites ke liye good default hai.

Future me smarter bin packing aur atlas JSON export add ho sakta hai, bina Sprite ya renderer API change kiye.

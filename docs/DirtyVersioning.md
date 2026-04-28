# Dirty Versioning

Dirty versioning is Raw2D's low-level change tracking system.

It answers one simple renderer question:

```text
Did this object or material change since the last time I prepared render data?
```

This is important for future WebGL static batch caching, texture batching, interaction tools, and React-style bindings.

## Object Versions

Every `Object2D` has a public readonly `version` number.

```ts
const rect = new Rect({
  width: 120,
  height: 80
});

console.log(rect.version);
// 0
```

When object data changes through Raw2D setters, the version increments:

```ts
rect.setPosition(100, 80);
rect.setSize(160, 100);
rect.setRenderMode("static");

console.log(rect.version);
// 3
```

## Dirty State

Use `getDirtyState()` when building renderer tools or debugging cache behavior.

```ts
console.log(rect.getDirtyState());
// { version: 3, dirty: true }
```

Renderers can mark an object clean after they rebuild cached data:

```ts
rect.markClean();

console.log(rect.getDirtyState());
// { version: 3, dirty: false }
```

If advanced code mutates data directly, call `markDirty()`:

```ts
rect.width = 240;
rect.markDirty();
```

Prefer Raw2D setters where possible because they mark dirty automatically.

## Material Versions

`BasicMaterial` also tracks `version` and dirty state.

```ts
const material = new BasicMaterial({
  fillColor: "#35c2ff"
});

material.markClean();
material.setFillColor("#f45b69");

console.log(material.getDirtyState());
// { version: 1, dirty: true }
```

This matters because a static object can stay still while its material changes.

## WebGL Cache Foundation

Static WebGL batches will use object and material versions to decide whether cached buffers can be reused.

```ts
const before = rect.version;

rect.setSize(200, 120);

if (rect.version !== before) {
  // Rebuild static batch data.
}
```

The current WebGL renderer exposes static and dynamic run stats. Dirty versioning is the next foundation under those stats.

## React Fiber Later

A future React binding can map prop changes to Raw2D setters:

```tsx
<rect2d x={100} y={80} width={120} height={80} />
```

When props change, the wrapper can call setters, object versions can update, and renderers can rebuild only the required data.

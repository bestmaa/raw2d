# Scene

`Scene` stores objects that should be rendered together.

It is similar to the scene idea in Three.js, but smaller for Raw2D's current MVP.

## Source Files

```text
src/core/Scene.ts
src/core/Scene.type.ts
```

## Basic Usage

```ts
const scene = new Scene();

scene.add(rect);
scene.add(circle);

raw2dCanvas.render(scene, camera);
```

## Methods

```ts
scene.add(object);
scene.remove(object);
scene.clear();
scene.getObjects();
```

## Why Scene Exists

Without `Scene`, `Canvas` owns the object list directly.

With `Scene`, object organization is separate from the browser canvas. This makes future APIs cleaner:

```ts
renderer.render(scene, camera);
```

It also helps future React/Fiber wrappers because React children can map to scene objects.

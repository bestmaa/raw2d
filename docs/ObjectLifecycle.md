# Object Lifecycle

Object lifecycle helpers make scene ownership explicit without adding React to core.

## Why It Exists

Future adapters, including a React Fiber-style package, need to know when a Raw2D object is attached, detached, or disposed.

Raw2D keeps that lifecycle in `raw2d-core`, so Canvas, WebGL, MCP, React, and vanilla apps can use the same rules.

## Scene And Group Hooks

`Scene` and `Group2D` call lifecycle helpers automatically.

```ts
const scene = new Scene();
const rect = new Rect({ width: 120, height: 80 });

scene.add(rect);
console.log(getObject2DLifecycleState(rect).parent === scene);

scene.remove(rect);
console.log(getObject2DLifecycleState(rect).parent);
```

## Adapter Ownership

Advanced adapters can call the helpers directly.

```ts
const parent = { id: "react-root", name: "Raw2D React root" };

attachObject2D({ object: rect, parent });
detachObject2D({ object: rect, parent });
disposeObject2D(rect);
```

## State Shape

Lifecycle state is intentionally small.

```ts
const state = getObject2DLifecycleState(rect);

state.parent;   // Scene, Group2D, adapter parent, or null
state.disposed; // true after disposeObject2D(rect)
```

## Renderer Rule

Renderers do not own lifecycle state. They only read the scene and draw supported objects.

Lifecycle helpers are for ownership, cleanup, and adapter reconciliation. Drawing still flows through the renderer.

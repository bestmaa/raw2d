# React Renderer API Audit

This audit checks whether Raw2D's renderer APIs are stable enough for a future React Fiber-style reconciler.

## Audit Result

Raw2D has enough public renderer structure for a first Fiber design, but lifecycle hooks should be added before a real reconciler mutates objects at scale.

```txt
Current: JSX adapter can call public renderer APIs.
Needed: stable object attach/detach/update hooks.
Avoid: private renderer cache or batch buffer access.
```

## Stable APIs

The future adapter can rely on these public APIs:

- `Scene.add(object)` and `Scene.remove(object)`
- `Scene.traverse(callback)`
- `Canvas.render(scene, camera)`
- `Canvas.clear()`
- `Canvas.setSize(width, height)`
- `WebGLRenderer2D.render(scene, camera)`
- `WebGLRenderer2D.clear()`
- `WebGLRenderer2D.setSize(width, height)`
- public object transform fields
- public material fields and setters

These APIs match Raw2D's explicit-control direction and do not require React-specific behavior.

## Reconciliation Needs

React reconciliation needs deterministic object ownership:

- create Raw2D instance once for a JSX element
- update public fields when props change
- attach to parent scene or group
- detach when JSX element unmounts
- request render after committed mutations
- release owned listeners, textures, or controller state

The adapter should hold the React-to-Raw2D instance map. Core should not store React keys.

## Current Gap

Raw2D objects can be added, removed, and updated today, but there is no formal lifecycle event for attach, detach, dispose, or mutation notifications.

That gap matters because a reconciler needs reliable cleanup and render invalidation without reading private fields.

## Required Core Additions

Before building `raw2d-react-fiber`, add small lifecycle hooks:

```ts
object.onAttach(parent);
object.onDetach(parent);
object.dispose();
object.markDirty();
```

The exact API can change, but the rule should stay: lifecycle hooks are core concepts, React is only one caller.

## Renderer Rule

Renderer APIs should remain simple:

```ts
renderer.render(scene, camera);
renderer.setSize(width, height);
renderer.clear();
renderer.dispose();
```

React should schedule when to call these methods. Renderers should not import React, read JSX, or own reconciliation state.

## Decision

Renderer APIs are stable enough for planning. The next implementation step should be object lifecycle hooks, then a JSX reconciler data model.

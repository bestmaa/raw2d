# Transform Matrix

Raw2D stores transform data directly on objects:

```ts
rect.x = 120;
rect.y = 80;
rect.rotation = 0.4;
rect.scaleX = 2;
rect.scaleY = 2;
```

Behind that simple API, `Object2D` now keeps cached local and world matrices.

## Why This Exists

Canvas can draw directly from `x`, `y`, `rotation`, and `scale`, but a real engine needs one shared transform source.

Matrix caching helps:

- Canvas rendering
- future WebGL rendering
- bounds
- culling
- hit testing
- picking
- resize tools
- group transforms
- future dirty update optimization

The goal is not to make app code more complex. App code can still update normal object fields. Raw2D handles the matrix cache internally.

## Dirty Updates

When transform fields change, Raw2D marks the matrix dirty:

```ts
rect.updateMatrix();
console.log(rect.getMatrixState());

rect.x = 200;
console.log(rect.getMatrixState());
```

The next call to `getLocalMatrix()`, `getWorldMatrix()`, `updateMatrix()`, or `updateWorldMatrix()` refreshes the cached data.

## Local Matrix

The local matrix represents the object's own transform:

```ts
rect.setPosition(100, 80);
rect.rotation = Math.PI / 4;
rect.setScale(2);

const localMatrix = rect.getLocalMatrix();
```

This matrix contains translation, rotation, and scale.

## World Matrix

The world matrix includes parent transform when the object is inside a group:

```ts
group.updateWorldMatrix();
rect.updateWorldMatrix(group.getWorldMatrix());

const worldMatrix = rect.getWorldMatrix();
```

`RenderPipeline` updates this automatically when it walks a scene or a group tree.

## RenderItem Snapshots

Every render item contains matrix snapshots:

```ts
const renderList = raw2dCanvas.createRenderList(scene, camera);
const item = renderList.getFlatItems()[0];

console.log(item.localMatrix);
console.log(item.worldMatrix);
```

Canvas uses local matrices for nested drawing. Future WebGL can use world matrices when filling buffers.

## Matrix3

Use `Matrix3` directly when building low-level tools or custom renderer experiments:

```ts
import { Matrix3 } from "raw2d";

const matrix = new Matrix3().compose(100, 80, 0.5, 2, 2);
const point = matrix.transformPoint({ x: 10, y: 20 });
```

You can also multiply parent and child matrices:

```ts
const world = new Matrix3().multiplyMatrices(parentMatrix, childMatrix);
```

## Current Scope

This is the transform foundation. It does not add a full transform hierarchy object model yet. `Group2D` plus `RenderPipeline` provide parent matrix updates for rendering, and deeper editor tooling can build on top of this.


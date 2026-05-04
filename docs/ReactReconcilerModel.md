# React Reconciler Model

This design describes the data model a future `raw2d-react-fiber` package can use to map JSX into Raw2D objects.

## Model Goal

The reconciler should keep React ownership separate from Raw2D runtime objects.

```txt
React element -> HostNode -> Raw2D object -> Scene/Group2D
```

Raw2D objects should stay normal `Rect`, `Circle`, `Sprite`, `Text2D`, `Scene`, and `Camera2D` instances.

## Host Node

Each JSX element should map to a small host node.

```ts
interface Raw2DHostNode {
  readonly id: string;
  readonly type: string;
  readonly object: Object2D | Scene | Camera2D;
  readonly propsVersion: number;
}
```

The host node belongs to the React package, not to `raw2d-core`.

## Parent Model

Parenting should use public Raw2D APIs.

```txt
Raw2DCanvas
  Scene
    Group2D
      Rect
      Sprite
```

React append/remove operations should call `Scene.add`, `Scene.remove`, `Group2D.add`, and `Group2D.remove`.

## Props Model

Props should map to public setters or public fields.

```ts
rawRect props -> Rect.setPosition, Rect.setSize, material setters
rawSprite props -> Sprite texture/frame/size setters
rawText2D props -> Text2D text/font/material setters
```

The reconciler should not write private fields.

## Render Invalidation

After React commits a mutation, the adapter should request one render.

```txt
commit props -> mark object dirty -> schedule render -> renderer.render(scene, camera)
```

Batching React commits into one render is better than rendering after every prop write.

## Identity

React keys should only affect the adapter host node map.

```tsx
<rawRect key="card-a" x={80} y={80} width={160} height={96} />
```

Raw2D core should not store React keys.

## Cleanup

Unmount should remove the object from its parent and dispose adapter-owned resources.

```ts
detachObject2D({ object, parent });
disposeObject2D(object);
```

Texture disposal should happen only when the adapter owns the texture.

## Non-Goals

- no hidden global scene
- no private renderer cache access
- no automatic physics or layout engine
- no React dependency in Raw2D core packages

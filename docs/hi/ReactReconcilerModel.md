# React Reconciler Model

Ye design batata hai ki future `raw2d-react-fiber` package JSX ko Raw2D objects me kaise map karega.

## Model Goal

Reconciler ko React ownership ko Raw2D runtime objects se alag rakhna chahiye.

```txt
React element -> HostNode -> Raw2D object -> Scene/Group2D
```

Raw2D objects normal `Rect`, `Circle`, `Sprite`, `Text2D`, `Scene`, aur `Camera2D` instances hi rahenge.

## Host Node

Har JSX element ek small host node se map hona chahiye.

```ts
interface Raw2DHostNode {
  readonly id: string;
  readonly type: string;
  readonly object: Object2D | Scene | Camera2D;
  readonly propsVersion: number;
}
```

Host node React package ka hoga, `raw2d-core` ka nahi.

## Parent Model

Parenting public Raw2D APIs se honi chahiye.

```txt
Raw2DCanvas
  Scene
    Group2D
      Rect
      Sprite
```

React append/remove operations `Scene.add`, `Scene.remove`, `Group2D.add`, aur `Group2D.remove` call karenge.

## Props Model

Props public setters ya public fields se map honge.

```ts
rawRect props -> Rect.setPosition, Rect.setSize, material setters
rawSprite props -> Sprite texture/frame/size setters
rawText2D props -> Text2D text/font/material setters
```

Reconciler private fields write nahi karega.

## Render Invalidation

React mutation commit hone ke baad adapter ek render request karega.

```txt
commit props -> mark object dirty -> schedule render -> renderer.render(scene, camera)
```

Har prop write ke baad render karne ke bajay React commit ko ek render me batch karna better hai.

## Identity

React keys sirf adapter host node map ko affect karenge.

```tsx
<rawRect key="card-a" x={80} y={80} width={160} height={96} />
```

Raw2D core React keys store nahi karega.

## Cleanup

Unmount par object ko parent se remove karo aur adapter-owned resources dispose karo.

```ts
detachObject2D({ object, parent });
disposeObject2D(object);
```

Texture disposal sirf tab hona chahiye jab adapter texture own karta ho.

## Non-Goals

- hidden global scene nahi
- private renderer cache access nahi
- automatic physics ya layout engine nahi
- Raw2D core packages me React dependency nahi

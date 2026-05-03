# Raw2D JSX Mapping Design

The future `raw2d-react` package should map JSX elements to existing Raw2D classes with clear, predictable rules.

## Renderer

`Raw2DCanvas` should own the canvas element and create the selected renderer.

```tsx
<Raw2DCanvas renderer="canvas" width={800} height={480} />
<Raw2DCanvas renderer="webgl" width={800} height={480} />
```

## Scene And Camera

Scene and camera should be explicit so React users can understand the same structure used by the low-level API.

```tsx
<Raw2DCanvas renderer="webgl">
  <rawScene>
    <rawCamera x={0} y={0} zoom={1} />
  </rawScene>
</Raw2DCanvas>
```

## Objects

Object names should stay close to Raw2D class names, with `raw` prefixes to avoid conflicts with HTML elements.

```tsx
<rawRect x={80} y={80} width={160} height={96} fillColor="#35c2ff" />
<rawCircle x={320} y={130} radius={48} fillColor="#facc15" />
<rawLine x={80} y={240} startX={0} startY={0} endX={260} endY={0} strokeColor="#f5f7fb" />
<rawText2D x={80} y={320} text="Raw2D" font="32px sans-serif" fillColor="#f5f7fb" />
```

## Materials

The first JSX bridge can accept common style props and create `BasicMaterial` internally. Advanced material objects can come later.

```tsx
<rawRect fillColor="#35c2ff" strokeColor="#f5f7fb" lineWidth={2} />
```

## Update Rule

Prop updates should mutate public object properties only. If an object type needs special methods, the bridge should call public methods such as `setPoints`.

## Identity Rule

React keys should map to stable Raw2D object instances. Reordering JSX should not recreate objects unless the key or element type changes.


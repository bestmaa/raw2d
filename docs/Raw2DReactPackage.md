# Raw2D React Package

`raw2d-react` is the React bridge for Raw2D. It keeps React support outside the core renderer packages.

## Install

```bash
npm install raw2d raw2d-react react react-dom
```

## Basic Canvas

Use `Raw2DCanvas` as the host component. Choose `renderer="canvas"` first for broad compatibility.

```tsx
import { Raw2DCanvas, RawRect } from "raw2d-react";

export function App() {
  return (
    <Raw2DCanvas renderer="canvas" width={800} height={480} backgroundColor="#10141c">
      <RawRect x={80} y={80} width={160} height={96} fillColor="#35c2ff" />
    </Raw2DCanvas>
  );
}
```

## Primitives

The first component set maps to Raw2D objects.

```tsx
<RawRect x={80} y={80} width={160} height={96} fillColor="#35c2ff" />
<RawCircle x={320} y={128} radius={48} fillColor="#f45b69" />
<RawLine x={80} y={240} endX={260} endY={0} strokeColor="#f5f7fb" lineWidth={4} />
<RawText2D x={80} y={320} text="Raw2D React" font="32px sans-serif" fillColor="#f5f7fb" />
```

## Sprite

Pass an existing Raw2D `Texture` to `RawSprite`.

```tsx
import { Texture } from "raw2d";
import { RawSprite } from "raw2d-react";

const texture = new Texture({ source: image, width: 64, height: 64 });

<RawSprite texture={texture} x={420} y={96} width={64} height={64} />;
```

## Renderer Choice

Use WebGL when batching and texture-heavy scenes matter.

```tsx
<Raw2DCanvas renderer="webgl" fallbackToCanvas width={800} height={480}>
  <RawCircle x={160} y={120} radius={48} fillColor="#facc15" />
</Raw2DCanvas>
```

## Boundary

`raw2d-react` wraps public Raw2D APIs. It should not require private renderer caches, private batch buffers, or hidden scene mutation.


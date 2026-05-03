# Raw2D React Package

`raw2d-react` Raw2D ka React bridge hai. React support core renderer packages ke bahar rakha gaya hai.

## Install

```bash
npm install raw2d raw2d-react react react-dom
```

## Basic Canvas

`Raw2DCanvas` host component hai. Sabse pehle `renderer="canvas"` use karein, kyunki ye broad compatibility deta hai.

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

Pehla component set Raw2D objects se map hota hai.

```tsx
<RawRect x={80} y={80} width={160} height={96} fillColor="#35c2ff" />
<RawCircle x={320} y={128} radius={48} fillColor="#f45b69" />
<RawLine x={80} y={240} endX={260} endY={0} strokeColor="#f5f7fb" lineWidth={4} />
<RawText2D x={80} y={320} text="Raw2D React" font="32px sans-serif" fillColor="#f5f7fb" />
```

## Sprite

`RawSprite` ko existing Raw2D `Texture` pass karein.

```tsx
import { Texture } from "raw2d";
import { RawSprite } from "raw2d-react";

const texture = new Texture({ source: image, width: 64, height: 64 });

<RawSprite texture={texture} x={420} y={96} width={64} height={64} />;
```

## Renderer Choice

Jab batching aur texture-heavy scene important ho, tab WebGL use karein.

```tsx
<Raw2DCanvas renderer="webgl" fallbackToCanvas width={800} height={480}>
  <RawCircle x={160} y={120} radius={48} fillColor="#facc15" />
</Raw2DCanvas>
```

## Boundary

`raw2d-react` public Raw2D APIs ko wrap karta hai. Isko private renderer caches, private batch buffers, ya hidden scene mutation ki zarurat nahi honi chahiye.


# raw2d-react

React bridge package for Raw2D.

This package lets React apps mount a Raw2D canvas and describe basic Raw2D scene objects with React components. It stays separate from the runtime packages so `raw2d-core`, `raw2d-canvas`, and `raw2d-webgl` do not depend on React.

```bash
npm install raw2d raw2d-react react
```

## Basic Usage

```tsx
import { Raw2DCanvas, RawCircle, RawLine, RawRect, RawText2D } from "raw2d-react";

export function App() {
  return (
    <Raw2DCanvas renderer="canvas" width={800} height={480} backgroundColor="#10141c">
      <RawRect x={80} y={80} width={160} height={96} fillColor="#35c2ff" />
      <RawCircle x={320} y={128} radius={48} fillColor="#f45b69" />
      <RawLine x={80} y={240} endX={260} endY={0} strokeColor="#f5f7fb" lineWidth={4} />
      <RawText2D x={80} y={320} text="Raw2D React" font="32px sans-serif" fillColor="#f5f7fb" />
    </Raw2DCanvas>
  );
}
```

## Current Status

- `<Raw2DCanvas>` component
- `RawRect`, `RawCircle`, `RawLine`, `RawSprite`, and `RawText2D`
- explicit Canvas/WebGL renderer selection
- no renderer API changes
- no React dependency inside Raw2D runtime packages

## Planned Direction

- lifecycle cleanup for objects, listeners, and textures
- hooks for scene access
- suspense-friendly asset loaders
- interaction helper components

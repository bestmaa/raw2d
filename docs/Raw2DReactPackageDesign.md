# Raw2D React Package Design

Raw2D React support should be a separate package, not a change to the core renderer API.

## Goal

The future package should let React users describe Raw2D scenes with JSX while keeping Raw2D usable without React.

```tsx
<Raw2DCanvas renderer="webgl" width={800} height={480}>
  <rawScene>
    <rawCamera x={0} y={0} zoom={1} />
    <rawRect x={80} y={80} width={160} height={96} fillColor="#35c2ff" />
  </rawScene>
</Raw2DCanvas>
```

## Package Boundary

The package name should be `raw2d-react`. It should depend on Raw2D packages, but Raw2D packages must not depend on React.

```txt
raw2d-core        no React
raw2d-canvas      no React
raw2d-webgl       no React
raw2d-react       owns JSX bridge
```

## Core API Rule

React support must wrap public APIs like `Scene`, `Camera2D`, `Canvas`, `WebGLRenderer2D`, `Rect`, `Sprite`, and `Text2D`. It should not require renderer internals or private object fields.

## Renderer Choice

React users should choose Canvas or WebGL explicitly. The wrapper can provide a default, but the renderer class should stay visible.

```tsx
<Raw2DCanvas renderer="canvas" />
<Raw2DCanvas renderer="webgl" />
```

## Lifecycle

The React bridge should create Raw2D objects, update their public properties when props change, and dispose listeners or textures when components unmount.

## Not In The First React Package

- No physics.
- No ECS.
- No plugin system.
- No hidden renderer rewrite.
- No automatic npm publish from plugin commands.


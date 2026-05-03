# Raw2D React Package Design

Raw2D ka React support alag package me rehna chahiye. Core renderer API ko React ke liye change nahi karna hai.

## Goal

Future package ka goal hai ki React users JSX se Raw2D scene describe kar sakein, par Raw2D bina React ke bhi same tarah kaam kare.

```tsx
<Raw2DCanvas renderer="webgl" width={800} height={480}>
  <rawScene>
    <rawCamera x={0} y={0} zoom={1} />
    <rawRect x={80} y={80} width={160} height={96} fillColor="#35c2ff" />
  </rawScene>
</Raw2DCanvas>
```

## Package Boundary

Package ka naam `raw2d-react` hona chahiye. Ye Raw2D packages ko use karega, lekin Raw2D runtime packages React par depend nahi karenge.

```txt
raw2d-core        no React
raw2d-canvas      no React
raw2d-webgl       no React
raw2d-react       JSX bridge own karega
```

## Core API Rule

React support public APIs ko wrap karega: `Scene`, `Camera2D`, `Canvas`, `WebGLRenderer2D`, `Rect`, `Sprite`, aur `Text2D`. Isko renderer internals ya private object fields ki zarurat nahi honi chahiye.

## Renderer Choice

React users Canvas ya WebGL explicitly choose kar sakein. Wrapper default de sakta hai, par renderer class visible rehni chahiye.

```tsx
<Raw2DCanvas renderer="canvas" />
<Raw2DCanvas renderer="webgl" />
```

## Lifecycle

React bridge Raw2D objects create karega, props change hone par public properties update karega, aur component unmount hone par listeners ya textures dispose karega.

## First React Package Me Nahi

- Physics nahi.
- ECS nahi.
- Plugin system nahi.
- Hidden renderer rewrite nahi.
- Plugin commands se automatic npm publish nahi.


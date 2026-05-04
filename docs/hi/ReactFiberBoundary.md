# React Fiber Boundary

Raw2D me future me React Fiber-style package aa sakta hai, lekin ye package rendering engine core se alag rehna chahiye.

## Boundary Kyun Jaruri Hai

Raw2D pehle low-level engine hai. Core packages vanilla TypeScript, browser apps, MCP tools, examples, aur future adapters me bina React ke kaam karne chahiye.

React support ek adapter layer hona chahiye:

```txt
React JSX -> raw2d-react-fiber -> Raw2D public API -> Renderer
```

Adapter React reconciliation handle karega. Raw2D core sirf stable scene, object, material, texture, aur renderer APIs expose karega.

## Package Scope

Future Fiber package current `raw2d-react` se alag hona chahiye.

```txt
raw2d-react        current simple React bridge
raw2d-react-fiber  future custom reconciler package
raw2d-core         no React dependency
raw2d-canvas       no React dependency
raw2d-webgl        no React dependency
```

Isse React optional rahega aur renderer packages React internals par depend nahi karenge.

## Adapter Kya Karega

Fiber package ye kaam kar sakta hai:

- JSX se Raw2D objects create aur update karna
- objects ko `Scene` me attach karna
- JSX props ko public object/material fields se map karna
- commit ke baad renderer render call karna
- owned textures, event handlers, aur object references cleanup karna
- Canvas aur WebGL dono ko explicit renderer selection se support karna

## Core Kya Karega

Raw2D core ko ye stable cheeze deni chahiye:

- object lifecycle APIs
- public transform aur material mutation APIs
- scene add/remove/traverse behavior
- renderer stats aur render methods
- explicit texture aur atlas APIs

Core ko ye nahi pata hona chahiye ki scene React, MCP, ya plain TypeScript se control ho raha hai.

## Non-Goals

Fiber package ko ye kaam nahi karna chahiye:

- Canvas/WebGL choice hide karna
- Raw2D scene graph rewrite karna
- private renderer caches par depend karna
- private batch buffers direct mutate karna
- physics, ECS, WASM, ya plugin system add karna
- non-React users ke liye required package banna

## First Milestone

First Fiber milestone me small host element set support karna chahiye.

```tsx
<Raw2DCanvas renderer="webgl" width={800} height={480}>
  <rawRect x={80} y={80} width={160} height={96} fillColor="#35c2ff" />
  <rawCircle x={320} y={128} radius={48} fillColor="#facc15" />
</Raw2DCanvas>
```

Implementation pehle creation, prop update, removal, render invalidation, aur cleanup prove kare. Advanced helpers baad me add honge.

## Decision

React Fiber support tab banana sahi rahega jab renderer APIs aur object lifecycle hooks stable ho jayen. Abhi `raw2d-react` simple bridge rahega; future Fiber package advanced reconciler hoga.

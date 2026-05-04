# React Fiber Boundary

Raw2D can support a future React Fiber-style package, but that package must stay outside the rendering engine core.

## Why This Boundary Exists

Raw2D is a low-level engine first. The core packages should stay usable from plain TypeScript, vanilla browser apps, MCP tools, examples, and future adapters.

React support should be an adapter layer:

```txt
React JSX -> raw2d-react-fiber -> Raw2D public API -> Renderer
```

The adapter can own React reconciliation details. Raw2D core should only expose stable scene, object, material, texture, and renderer APIs.

## Package Scope

The future package should be separate from `raw2d-react`.

```txt
raw2d-react        current simple React bridge
raw2d-react-fiber  future custom reconciler package
raw2d-core         no React dependency
raw2d-canvas       no React dependency
raw2d-webgl        no React dependency
```

This keeps React optional and prevents renderer packages from depending on React internals.

## Adapter Responsibilities

The Fiber package may:

- create and update Raw2D objects from JSX
- attach objects to `Scene`
- map JSX props to public object and material fields
- call renderer render methods after commits
- dispose owned textures, event handlers, and object references
- support Canvas and WebGL through explicit renderer selection

## Core Responsibilities

Raw2D core should provide:

- stable object lifecycle APIs
- public transform and material mutation APIs
- scene add/remove/traverse behavior
- renderer stats and render methods
- explicit texture and atlas APIs

Core must not know whether React, MCP, or plain TypeScript is driving the scene.

## Non-Goals

The Fiber package should not:

- hide Canvas/WebGL renderer choice
- rewrite Raw2D's scene graph
- depend on private renderer caches
- mutate private batch buffers directly
- add physics, ECS, WASM, or plugin systems
- become required for non-React users

## First Milestone

The first Fiber milestone should support a small host element set.

```tsx
<Raw2DCanvas renderer="webgl" width={800} height={480}>
  <rawRect x={80} y={80} width={160} height={96} fillColor="#35c2ff" />
  <rawCircle x={320} y={128} radius={48} fillColor="#facc15" />
</Raw2DCanvas>
```

The implementation should prove creation, prop update, removal, render invalidation, and cleanup before adding advanced helpers.

## Decision

React Fiber support should wait until renderer APIs and object lifecycle hooks are stable. The current `raw2d-react` package remains the simple bridge; the future Fiber package becomes the advanced reconciler.

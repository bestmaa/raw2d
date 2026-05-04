# Showcase Demo

The Raw2D showcase is a real-world demo for proving the engine with one scene and two renderers.

## Why It Exists

Raw2D needs a demo that shows its identity clearly:

- low-level control
- modular objects
- Canvas correctness
- WebGL batching pressure
- transparent stats
- practical interaction

The showcase should help a developer answer: should this scene use Canvas, WebGL, an atlas, static batches, culling, or interaction tools?

## What It Proves

The demo proves these Raw2D ideas in one place:

- the same `Scene` and `Camera2D` can drive Canvas and WebGL
- Canvas is the readable correctness path
- WebGL is the batch-first performance path
- stats expose draw calls, texture binds, culling, and cache behavior
- interaction changes object data, then the renderer draws the new state

Raw2D should stay transparent. The showcase makes renderer choices visible instead of hiding them behind a large framework API.

## Scene Scope

The first showcase should include:

- 300+ sprites
- 100+ simple shapes
- text labels
- static background objects
- dynamic selected objects
- camera pan and zoom
- selection, drag, and resize
- live renderer stats
- Canvas/WebGL renderer switch
- camera pan, zoom, reset, and minimap viewport hints
- selection, drag, resize, and transform handles through interaction tools
- live renderer stats and copyable performance report
- atlas sorting, static batch, dynamic mode, and culling toggles

## Performance Targets

Canvas target:

- correct visual output
- predictable debugging
- useful fallback path

WebGL target:

- fewer draw calls where batching is possible
- lower texture binds with atlas usage
- clear static and dynamic batch stats

## How To Read The Demo

Start with Canvas when the scene is simple, debugging matters, or browser support should be boring.

Switch to WebGL when the scene has many sprites, repeated textures, or enough objects that batching and culling matter.

Use the toggles like this:

- atlas sorting: check whether texture binds drop
- static batches: check whether background objects reuse cached work
- culling: check whether off-camera objects stop spending render work
- renderer switch: compare correctness first, then performance

## Copyable Route

```text
/examples/showcase/
```

Use `/doc#showcase-demo` for the written guide and `/examples/showcase/` for the live scene.

## Verification

Every showcase task should run:

```bash
npm run typecheck
npm test
npm run build:docs
npm run test:browser
```

Manual browser checks should include `/examples/showcase/` and `/doc#showcase-demo`.

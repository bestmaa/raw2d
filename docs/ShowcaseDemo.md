# Showcase Demo

The Raw2D showcase is a real-world demo plan for proving the engine with one scene and two renderers.

## Why It Exists

Raw2D needs a demo that shows its identity clearly:

- low-level control
- modular objects
- Canvas correctness
- WebGL batching pressure
- transparent stats
- practical interaction

The showcase should help a developer answer: should this scene use Canvas, WebGL, an atlas, static batches, culling, or interaction tools?

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

## Performance Targets

Canvas target:

- correct visual output
- predictable debugging
- useful fallback path

WebGL target:

- fewer draw calls where batching is possible
- lower texture binds with atlas usage
- clear static and dynamic batch stats

## Verification

Every showcase task should run:

```bash
npm run typecheck
npm test
npm run build:docs
npm run test:browser
```

Manual browser checks should include `/examples/showcase/` and `/doc#showcase-demo`.

# Glossary

Short definitions for common Raw2D words.

## Scene

A `Scene` stores the objects that should be considered for rendering. It does not draw them.

## Renderer

A renderer draws a scene through a camera. `Canvas` is the complete reference renderer. `WebGLRenderer2D` is the batch-first renderer.

## RenderList

A `RenderList` is the flattened, sorted list of visible render items created from a scene. It keeps render order, culling results, and matrix snapshots explicit.

## Batch

A batch is a compatible group of objects that WebGL can draw with fewer state changes. Fewer batches usually means fewer draw calls.

## Buffer

A buffer is typed numeric data prepared for the GPU. WebGL shape and sprite paths write vertex data into buffers before upload.

## Shader

A shader is GPU code used by WebGL to draw geometry. Raw2D keeps shaders inside the WebGL package.

## Draw Call

A draw call asks the GPU to draw the current batch. Raw2D exposes draw-call stats so performance is visible.

## Atlas

A texture atlas packs many sprite frames into one texture. This can reduce WebGL texture binds.

## Bounds

Bounds describe an object's rectangle. Bounds are used for culling, picking, selection, and resize tools.

## Hit Testing

Hit testing checks whether a point is inside or near an object.

## Picking

Picking uses hit testing plus scene order to return the topmost object under a pointer.

## Culling

Culling skips objects outside the camera viewport before drawing.

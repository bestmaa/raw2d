# WebGLBufferUploader

`WebGLBufferUploader` owns one GPU buffer and decides how vertex data should be uploaded.

It keeps Raw2D's WebGL path explicit:

```text
Batch -> Float32Array -> WebGLBufferUploader -> GPU Buffer
```

## Why It Exists

Calling `gl.bufferData` every frame can force WebGL to recreate or reallocate GPU buffer storage. That is sometimes needed when the next frame is bigger, but it is wasteful when the existing GPU buffer is already large enough.

`WebGLBufferUploader` tracks capacity in bytes:

- if new data is bigger than current capacity, it uses `bufferData`
- if new data fits in current capacity, it uses `bufferSubData`

This is a small foundation for future static and dynamic batches.

## Basic Usage

```ts
import { WebGLBufferUploader } from "raw2d-webgl";

const uploader = new WebGLBufferUploader({
  gl,
  target: gl.ARRAY_BUFFER,
  usage: gl.DYNAMIC_DRAW
});

const result = uploader.upload(vertices);

console.log(result);
// {
//   mode: "bufferData",
//   byteLength: 288,
//   capacity: 288
// }
```

Later, smaller or same-size uploads reuse capacity:

```ts
const result = uploader.upload(nextFrameVertices);

console.log(result.mode);
// "bufferSubData"
```

## Renderer Usage

`WebGLRenderer2D` keeps one uploader for shape vertices and one uploader for sprite vertices.

```ts
renderer.render(scene, camera);
console.log(renderer.getStats());
```

Stats expose upload behavior:

```ts
{
  uploadBufferDataCalls: 1,
  uploadBufferSubDataCalls: 0,
  uploadedBytes: 288
}
```

If the next render fits the same GPU capacity:

```ts
{
  uploadBufferDataCalls: 0,
  uploadBufferSubDataCalls: 1,
  uploadedBytes: 288
}
```

## Relationship To WebGLFloatBuffer

`WebGLFloatBuffer` reuses CPU-side `Float32Array` storage.

`WebGLBufferUploader` reuses GPU-side buffer capacity.

Together they reduce per-frame allocation pressure while keeping the WebGL pipeline readable.

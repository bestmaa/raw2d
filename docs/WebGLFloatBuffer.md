# WebGLFloatBuffer

`WebGLFloatBuffer` is a reusable CPU-side `Float32Array` holder for WebGL batch writers.

Without reuse, a renderer can allocate a new typed array every frame:

```text
frame 1 -> new Float32Array(...)
frame 2 -> new Float32Array(...)
frame 3 -> new Float32Array(...)
```

With `WebGLFloatBuffer`, Raw2D grows capacity only when needed and reuses the same backing storage for later frames.

## Basic Usage

```ts
import { WebGLFloatBuffer, createWebGLSpriteBatch } from "raw2d-webgl";

const floatBuffer = new WebGLFloatBuffer();

const batch = createWebGLSpriteBatch({
  items: renderList.getFlatItems(),
  camera,
  width: 800,
  height: 600,
  getTextureKey: (texture) => texture.id,
  floatBuffer
});
```

The returned `batch.vertices` is still a `Float32Array`, so existing WebGL upload code stays simple:

```ts
gl.bufferData(gl.ARRAY_BUFFER, batch.vertices, gl.DYNAMIC_DRAW);
```

For production renderer code, pair it with `WebGLBufferUploader` so GPU buffer capacity can be reused too:

```ts
const upload = uploader.upload(batch.vertices);

console.log(upload.mode);
// "bufferData" or "bufferSubData"
```

## Capacity

```ts
const buffer = new WebGLFloatBuffer({
  initialCapacity: 4096,
  growthFactor: 2
});

const vertices = buffer.acquire(1024);

console.log(buffer.getSnapshot());
// { capacity: 4096, used: 1024 }
```

If a later frame needs more than capacity, the internal backing array grows. If it needs less, the same backing array is reused.

## Renderer Usage

`WebGLRenderer2D` uses internal `WebGLFloatBuffer` instances for shape and sprite batches. This is a foundation step for lower per-frame allocations before future static and dynamic batch systems.

This does not change the public scene API. It only changes how WebGL batch data is prepared internally.

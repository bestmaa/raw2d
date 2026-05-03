import type { DocTopic } from "./DocPage.type";

export const webGLBufferTopics: readonly DocTopic[] = [
  {
    id: "webgl-buffers",
    label: "WebGL Buffers",
    title: "WebGL Buffers",
    description: "WebGL buffers store the vertex data produced by Raw2D batchers before shaders draw it.",
    sections: [
      {
        title: "Why Buffers Matter",
        body: "Batchers create typed vertex arrays. Buffer uploaders move those arrays to the GPU with explicit size and upload stats.",
        code: `// Batcher -> Float32Array vertices
// BufferUploader -> WebGLBuffer
// Shader -> DrawCall`
      },
      {
        title: "BufferData Versus BufferSubData",
        body: "When a frame needs more GPU capacity, Raw2D uses bufferData. Later frames that fit reuse capacity with bufferSubData.",
        liveDemoId: "webgl-renderer",
        code: `webglRenderer.render(scene, camera);
console.log(webglRenderer.getStats().uploadBufferDataCalls);

webglRenderer.render(scene, camera);
console.log(webglRenderer.getStats().uploadBufferSubDataCalls);`
      },
      {
        title: "Uploaded Bytes",
        body: "uploadedBytes shows how much vertex data was sent this frame. Use it with drawCalls when tuning scene size.",
        liveDemoId: "webgl-performance",
        code: `webglRenderer.render(scene, camera);

const stats = webglRenderer.getStats();
console.log(stats.uploadedBytes);
console.log(stats.drawCalls);`
      },
      {
        title: "Static Buffer Reuse",
        body: "Clean static runs can skip vertex upload on later frames. This is the first cache win to check in mostly stable scenes.",
        liveDemoId: "webgl-performance",
        code: `background.setRenderMode("static");

webglRenderer.render(scene, camera);
webglRenderer.render(scene, camera);

console.log(webglRenderer.getStats().staticCacheHits);`
      },
      {
        title: "Practical Upload Report",
        body: "Use this report beside a scene while changing object count, culling, static mode, or atlas packing.",
        liveDemoId: "webgl-performance",
        code: `const stats = webglRenderer.getStats();

console.table({
  uploadedBytes: stats.uploadedBytes,
  bufferData: stats.uploadBufferDataCalls,
  bufferSubData: stats.uploadBufferSubDataCalls,
  staticCacheHits: stats.staticCacheHits,
  staticCacheMisses: stats.staticCacheMisses
});`
      }
    ]
  }
];

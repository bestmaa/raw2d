import type { DocTopic } from "./DocPage.type";

export const webGLRendererTopics: readonly DocTopic[] = [
  {
    id: "webgl-renderer",
    label: "WebGLRenderer2D",
    title: "WebGLRenderer2D",
    description: "WebGLRenderer2D renders primitives and Sprites through WebGL2 using RenderPipeline, ordered render runs, material batches, and texture batches.",
    sections: [
      {
        title: "First Working Scope",
        body: "WebGLRenderer2D renders Rect, Circle, Ellipse, Line, Polyline, convex Polygon, and Sprite objects. Other object types are counted as unsupported until their batches are implemented.",
        liveDemoId: "webgl-renderer",
        code: `const renderer = new WebGLRenderer2D({
  canvas: canvasElement,
  width: 800,
  height: 600,
  backgroundColor: "#10141c"
});

renderer.render(scene, camera);`
      },
      {
        title: "Sprite Texture Batch",
        body: "Sprites use a separate textured shader path. Consecutive Sprites using the same Texture are merged into one texture draw batch while render order stays stable.",
        liveDemoId: "webgl-renderer",
        code: `import { Sprite, Texture, WebGLRenderer2D } from "raw2d";

const texture = new Texture({
  source: imageElement,
  width: imageElement.naturalWidth,
  height: imageElement.naturalHeight
});

scene.add(new Sprite({
  texture,
  x: 40,
  y: 40,
  width: 64,
  height: 64
}));

webglRenderer.render(scene, camera);
console.log(webglRenderer.getStats().textures);`
      },
      {
        title: "Batch Stats",
        body: "Visible shapes are written into shape buffers. Visible Sprites are written into sprite buffers. Consecutive compatible items are merged by material key or texture key.",
        liveDemoId: "webgl-renderer",
        code: `renderer.render(scene, camera);

console.log(renderer.getStats());

// {
//   objects: 1000,
//   rects: 143,
//   circles: 143,
//   ellipses: 143,
//   lines: 143,
//   polylines: 143,
//   polygons: 143,
//   sprites: 142,
//   textures: 1,
//   batches: 600,
//   vertices: 33000,
//   drawCalls: 600,
//   uploadBufferDataCalls: 1,
//   uploadBufferSubDataCalls: 1,
//   uploadedBytes: 792000,
//   unsupported: 0
// }`
      },
      {
        title: "Canvas Comparison",
        body: "Canvas supports the full object set and draws through Canvas APIs. WebGL supports the high-volume path first and groups supported shapes and Sprites into ordered draw ranges.",
        liveDemoId: "webgl-renderer",
        code: `canvasRenderer.render(scene, camera);
console.log(canvasRenderer.getStats());
// { objects: 1000, drawCalls: 1000 }

webglRenderer.render(scene, camera);
console.log(webglRenderer.getStats());
// { objects: 1000, batches: 600, drawCalls: 600, textures: 1, uploadedBytes: 792000, unsupported: 0 }`
      },
      {
        title: "GPU Buffer Uploads",
        body: "WebGLRenderer2D reuses GPU buffer capacity. A larger frame uses bufferData to grow storage; later frames that fit use bufferSubData to update existing storage.",
        liveDemoId: "webgl-renderer",
        code: `webglRenderer.render(scene, camera);
console.log(webglRenderer.getStats().uploadBufferDataCalls);
// 1

webglRenderer.render(scene, camera);
console.log(webglRenderer.getStats().uploadBufferSubDataCalls);
// 1`
      },
      {
        title: "Ordered Runs",
        body: "Raw2D keeps render order stable. Material and texture grouping only merge consecutive compatible objects. A Sprite between two shapes intentionally starts a new shape run.",
        liveDemoId: "webgl-renderer",
        code: `scene.add(new Rect({ material: blue }));
scene.add(new Circle({ material: blue }));

// Sprite uses the texture path, so it starts a texture run.
scene.add(new Sprite({ texture }));

// Shape drawing resumes as a new shape run.
scene.add(new Line({ material: yellowStroke }));`
      },
      {
        title: "Current Limits",
        body: "Sprite batching uploads individual Texture sources into a cache but does not pack them into an atlas yet. Polygon batching uses a simple triangle fan, so convex polygons are the safe target first.",
        code: `// Good first WebGL polygon target: convex points.
scene.add(new Polygon({
  points: [
    { x: 0, y: 0 },
    { x: 80, y: 0 },
    { x: 80, y: 50 },
    { x: 0, y: 50 }
  ]
}));

// Future WebGL work:
// texture atlas
// static/dynamic batches`
      },
      {
        title: "Use Culling",
        body: "WebGLRenderer2D uses the same RenderPipeline culling idea as Canvas.",
        code: `webglRenderer.render(scene, camera, {
  culling: true
});`
      },
      {
        title: "Shared RenderList",
        body: "Build a render list manually when you want to inspect the scene before WebGL writes buffers.",
        code: `const renderList = webglRenderer.createRenderList(scene, camera, {
  culling: true
});

webglRenderer.render(scene, camera, { renderList });`
      },
      {
        title: "Typed Array Reuse",
        body: "WebGLRenderer2D uses reusable float buffers internally. Batch helpers can also accept a WebGLFloatBuffer when you build custom WebGL tooling.",
        code: `const floatBuffer = new WebGLFloatBuffer();

const batch = createWebGLSpriteBatch({
  items: renderList.getFlatItems(),
  camera,
  width,
  height,
  getTextureKey,
  floatBuffer
});

console.log(floatBuffer.getSnapshot());`
      },
      {
        title: "Buffer Uploader",
        body: "WebGLBufferUploader is the GPU-side pair to WebGLFloatBuffer. It tracks capacity and reports whether the upload used bufferData or bufferSubData.",
        code: `const uploader = new WebGLBufferUploader({
  gl,
  target: gl.ARRAY_BUFFER,
  usage: gl.DYNAMIC_DRAW
});

const upload = uploader.upload(batch.vertices);

console.log(upload);
// { mode: "bufferSubData", byteLength: 288, capacity: 512 }`
      }
    ]
  }
];

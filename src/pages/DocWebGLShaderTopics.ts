import type { DocTopic } from "./DocPage.type";

export const webGLShaderTopics: readonly DocTopic[] = [
  {
    id: "webgl-shaders",
    label: "WebGL Shaders",
    title: "WebGL Shaders",
    description: "Raw2D uses small WebGL2 shader programs for solid shapes and textured quads.",
    sections: [
      {
        title: "Two Shader Paths",
        body: "Shape geometry uses color attributes. Sprites and rasterized Text2D use UV attributes, alpha, and one texture sampler.",
        code: `// Shape path: a_position + a_color
// Texture path: a_position + a_uv + a_alpha + u_texture`
      },
      {
        title: "Shape Vertex Data",
        body: "Shape batch vertices are already transformed to clip-space. The shader only passes position and color through.",
        liveDemoId: "webgl-renderer",
        code: `// Per shape vertex:
// x, y, r, g, b, a

console.log(webglRenderer.getStats().vertices);`
      },
      {
        title: "Texture Vertex Data",
        body: "Sprite and Text2D vertices store clip-space position, UV coordinates, and alpha. Texture cache decides which WebGLTexture is bound.",
        liveDemoId: "webgl-performance",
        code: `// Per texture vertex:
// x, y, u, v, alpha

console.log(webglRenderer.getStats().textureBinds);`
      },
      {
        title: "Uniforms Stay Minimal",
        body: "Raw2D keeps uniforms small for now. The texture shader binds u_texture to texture unit 0; shape color is per vertex.",
        code: `// Current texture uniform:
// uniform sampler2D u_texture;

// Current shape color:
// in vec4 a_color;`
      },
      {
        title: "Program Setup",
        body: "Program setup enables attributes with explicit stride and offset. This keeps buffer layout readable and easy to debug.",
        code: `// Shape stride: 6 floats
// position offset: 0
// color offset: 2 floats

// Texture stride: 5 floats
// position offset: 0
// uv offset: 2 floats
// alpha offset: 4 floats`
      },
      {
        title: "Debug Shader Cost",
        body: "Start with render stats before changing shaders. If draw calls or texture binds are high, fix batching before adding shader complexity.",
        liveDemoId: "webgl-performance",
        code: `const stats = webglRenderer.getStats();

console.table({
  drawCalls: stats.drawCalls,
  textureBinds: stats.textureBinds,
  vertices: stats.vertices
});`
      }
    ]
  }
];

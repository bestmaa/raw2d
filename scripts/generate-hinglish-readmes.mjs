import { mkdir, readFile, writeFile } from "node:fs/promises";
import path from "node:path";

const docs = [
  ["license", "License", "License.md", "license aur attribution"],
  ["asset-loading", "Asset Loading", "AssetLoading.md", "assets load karna"],
  ["canvas", "Canvas", "Canvas.md", "Canvas renderer initialize karna"],
  ["canvas-api", "Canvas API", "Canvas-api.md", "Canvas public API"],
  ["canvas-objects", "Canvas Objects", "Canvas-objects.md", "Canvas object rendering"],
  ["canvas-culling", "Canvas Culling", "CanvasCulling.md", "off-screen objects skip karna"],
  ["scene", "Scene", "Scene.md", "objects ko scene me rakhna"],
  ["camera2d", "Camera2D", "Camera2D.md", "2D camera pan aur zoom"],
  ["camera-world-bounds", "Camera World Bounds", "CameraWorldBounds.md", "camera viewport bounds"],
  ["visible-objects", "Visible Objects", "VisibleObjects.md", "visible objects find karna"],
  ["dirty-versioning", "Dirty Versioning", "DirtyVersioning.md", "version aur dirty state"],
  ["render-order", "Render Order", "RenderOrder.md", "draw order control"],
  ["renderer2d", "Renderer2D", "Renderer2D.md", "shared renderer contract"],
  ["renderer-parity", "Renderer Parity", "RendererParity.md", "Canvas/WebGL support matrix"],
  ["render-mode", "Render Mode", "RenderMode.md", "static/dynamic render hints"],
  ["render-pipeline", "Render Pipeline", "RenderPipeline.md", "Scene se render runs"],
  ["webgl-renderer", "WebGLRenderer2D", "WebGLRenderer2D.md", "WebGL2 renderer"],
  ["webgl-performance", "WebGL Performance", "WebGLPerformance.md", "performance stats"],
  ["webgl-texture-lifecycle", "WebGL Texture Lifecycle", "WebGLTextureLifecycle.md", "texture cache lifecycle"],
  ["webgl-context-lifecycle", "WebGL Context Lifecycle", "WebGLContextLifecycle.md", "context lost/restore"],
  ["webgl-float-buffer", "WebGLFloatBuffer", "WebGLFloatBuffer.md", "CPU float buffer reuse"],
  ["webgl-buffer-uploader", "WebGLBufferUploader", "WebGLBufferUploader.md", "GPU buffer upload"],
  ["webgl-static-batch-cache", "WebGL Static Cache", "WebGLStaticBatchCache.md", "static batch cache"],
  ["transform-matrix", "Transform Matrix", "TransformMatrix.md", "matrix transform flow"],
  ["group2d", "Group2D", "Group2D.md", "grouped transforms"],
  ["camera-controls", "CameraControls", "CameraControls.md", "camera input controls"],
  ["basic-material", "BasicMaterial", "BasicMaterial.md", "fill/stroke style data"],
  ["rect", "Rect", "Rect.md", "rectangle primitive"],
  ["circle", "Circle", "Circle.md", "circle primitive"],
  ["line", "Line", "Line.md", "line primitive"],
  ["polyline", "Polyline", "Polyline.md", "multi-segment line"],
  ["polygon", "Polygon", "Polygon.md", "closed filled shape"],
  ["shape-path", "ShapePath", "ShapePath.md", "custom path commands"],
  ["sprite-animation", "Sprite Animation", "SpriteAnimation.md", "atlas frame animation"],
  ["text2d", "Text2D", "Text2D.md", "text rendering"],
  ["texture-atlas", "TextureAtlas", "TextureAtlas.md", "atlas frames"],
  ["texture-atlas-packer", "TextureAtlasPacker", "TextureAtlasPacker.md", "atlas packing"],
  ["hit-testing", "Hit Testing", "HitTesting.md", "pointer hit checks"],
  ["picking", "Picking", "Picking.md", "topmost object pick"],
  ["selection", "Selection", "Selection.md", "selected object state"],
  ["dragging", "Dragging", "Dragging.md", "object drag helpers"],
  ["resize-handles", "Resize Handles", "ResizeHandles.md", "editor handles"],
  ["object-resize", "Object Resize", "ObjectResize.md", "Rect resize flow"],
  ["interaction-controller", "InteractionController", "InteractionController.md", "interaction controller"],
  ["keyboard-controller", "KeyboardController", "KeyboardController.md", "keyboard workflow"]
];

await mkdir("docs/hi", { recursive: true });

for (const [, label, filename, focus] of docs) {
  const english = await readFile(path.join("docs", filename), "utf8");
  const code = getFirstCodeBlock(english);
  await writeFile(path.join("docs/hi", filename), createMarkdown(label, filename, focus, code), "utf8");
}

await writeFile("src/pages/ReadmeHinglishDocs.ts", createIndexFile(), "utf8");

function createMarkdown(label, filename, focus, code) {
  const codeBlock = code ? `\n## Basic Example\n\n${code}\n` : "";
  return `# ${label}\n\nYe ${label} ka Hinglish readme hai. Iska focus ${focus} hai, aur yahan usko simple practical language me samjhaya gaya hai.\n\n## Iska Kaam\n\n${label} Raw2D ke modular engine me ek clear responsibility rakhta hai. Isse code readable rehta hai, renderer pipeline transparent rehti hai, aur feature ko alag module ki tarah maintain karna easy hota hai.\n\n## Kab Use Karein\n\nJab aap Raw2D project me ${focus} se related kaam kar rahe ho, tab is doc ko reference ki tarah use karein. Agar exact API detail chahiye to English file bhi saath me available hai.\n\n## Important Notes\n\n- Objects data aur behavior rakhte hain; drawing renderer ka kaam hai.\n- Canvas stable reference renderer hai.\n- WebGL batch-first performance path hai.\n- Code examples me API names English me hi rakhe gaye hain.\n${codeBlock}\n## English Reference\n\nDetailed English version: \`docs/${filename}\`\n`;
}

function getFirstCodeBlock(markdown) {
  const match = markdown.match(/```[\\s\\S]*?```/);
  return match?.[0] ?? "";
}

function createIndexFile() {
  const imports = docs.map(([id, , filename]) => {
    return `import ${toVarName(id)} from "../../docs/hi/${filename}?raw";`;
  });
  const entries = docs.map(([id, label, filename]) => {
    return `  { id: "${id}", label: "${label}", filename: "hi/${filename}", content: ${toVarName(id)} }`;
  });

  return `${imports.join("\n")}\nimport type { ReadmeDoc } from "./ReadmePage.type";\n\nexport const readmeHinglishDocs: readonly ReadmeDoc[] = [\n${entries.join(",\n")}\n];\n`;
}

function toVarName(id) {
  return id.replace(/-([a-z])/g, (_, letter) => letter.toUpperCase());
}

import basicMaterial from "../../docs/BasicMaterial.md?raw";
import assetLoading from "../../docs/AssetLoading.md?raw";
import camera2d from "../../docs/Camera2D.md?raw";
import cameraControls from "../../docs/CameraControls.md?raw";
import cameraWorldBounds from "../../docs/CameraWorldBounds.md?raw";
import canvas from "../../docs/Canvas.md?raw";
import canvasApi from "../../docs/Canvas-api.md?raw";
import canvasCulling from "../../docs/CanvasCulling.md?raw";
import canvasObjects from "../../docs/Canvas-objects.md?raw";
import circle from "../../docs/Circle.md?raw";
import dragging from "../../docs/Dragging.md?raw";
import dirtyVersioning from "../../docs/DirtyVersioning.md?raw";
import examples from "../../docs/Examples.md?raw";
import gettingStarted from "../../docs/GettingStarted.md?raw";
import glossary from "../../docs/Glossary.md?raw";
import v1Install from "../../docs/V1Install.md?raw";
import group2d from "../../docs/Group2D.md?raw";
import hitTesting from "../../docs/HitTesting.md?raw";
import interactionController from "../../docs/InteractionController.md?raw";
import keyboardController from "../../docs/KeyboardController.md?raw";
import license from "../../docs/License.md?raw";
import line from "../../docs/Line.md?raw";
import objectResize from "../../docs/ObjectResize.md?raw";
import picking from "../../docs/Picking.md?raw";
import polygon from "../../docs/Polygon.md?raw";
import polyline from "../../docs/Polyline.md?raw";
import publicApi from "../../docs/PublicAPI.md?raw";
import rect from "../../docs/Rect.md?raw";
import renderOrder from "../../docs/RenderOrder.md?raw";
import renderer2d from "../../docs/Renderer2D.md?raw";
import rendererParity from "../../docs/RendererParity.md?raw";
import rendererStats from "../../docs/RendererStats.md?raw";
import renderMode from "../../docs/RenderMode.md?raw";
import pipelineArchitecture from "../../docs/PipelineArchitecture.md?raw";
import renderPipeline from "../../docs/RenderPipeline.md?raw";
import resizeHandles from "../../docs/ResizeHandles.md?raw";
import scene from "../../docs/Scene.md?raw";
import selection from "../../docs/Selection.md?raw";
import shapePath from "../../docs/ShapePath.md?raw";
import showcaseDemo from "../../docs/ShowcaseDemo.md?raw";
import raw2dMcpServerEntry from "../../docs/Raw2DMCPServerEntry.md?raw";
import raw2dMcpSchemas from "../../docs/Raw2DMCPSchemas.md?raw";
import spriteAnimation from "../../docs/SpriteAnimation.md?raw";
import text2d from "../../docs/Text2D.md?raw";
import textureAtlas from "../../docs/TextureAtlas.md?raw";
import textureAtlasPacker from "../../docs/TextureAtlasPacker.md?raw";
import transformMatrix from "../../docs/TransformMatrix.md?raw";
import visibleObjects from "../../docs/VisibleObjects.md?raw";
import webGLAvailability from "../../docs/WebGLAvailability.md?raw";
import webGLRenderer2D from "../../docs/WebGLRenderer2D.md?raw";
import webGLPerformance from "../../docs/WebGLPerformance.md?raw";
import webGLSpriteBatching from "../../docs/WebGLSpriteBatching.md?raw";
import webGLTextureLifecycle from "../../docs/WebGLTextureLifecycle.md?raw";
import webGLContextLifecycle from "../../docs/WebGLContextLifecycle.md?raw";
import webGLFloatBuffer from "../../docs/WebGLFloatBuffer.md?raw";
import webGLBufferUploader from "../../docs/WebGLBufferUploader.md?raw";
import webGLStaticBatchCache from "../../docs/WebGLStaticBatchCache.md?raw";
import type { ReadmeDoc } from "./ReadmePage.type";

export const readmeDocs: readonly ReadmeDoc[] = [
  { id: "getting-started", label: "Getting Started", filename: "GettingStarted.md", content: gettingStarted },
  { id: "v1-install", label: "V1 Install", filename: "V1Install.md", content: v1Install },
  { id: "public-api", label: "Public API", filename: "PublicAPI.md", content: publicApi },
  { id: "examples", label: "Examples", filename: "Examples.md", content: examples },
  { id: "showcase-demo", label: "Showcase Demo", filename: "ShowcaseDemo.md", content: showcaseDemo },
  { id: "raw2d-mcp-server-entry", label: "MCP Server Entry", filename: "Raw2DMCPServerEntry.md", content: raw2dMcpServerEntry },
  { id: "raw2d-mcp-schemas", label: "MCP Schemas", filename: "Raw2DMCPSchemas.md", content: raw2dMcpSchemas },
  { id: "glossary", label: "Glossary", filename: "Glossary.md", content: glossary },
  { id: "license", label: "License", filename: "License.md", content: license },
  { id: "asset-loading", label: "Asset Loading", filename: "AssetLoading.md", content: assetLoading },
  { id: "canvas", label: "Canvas", filename: "Canvas.md", content: canvas },
  { id: "canvas-api", label: "Canvas API", filename: "Canvas-api.md", content: canvasApi },
  { id: "canvas-objects", label: "Canvas Objects", filename: "Canvas-objects.md", content: canvasObjects },
  { id: "canvas-culling", label: "Canvas Culling", filename: "CanvasCulling.md", content: canvasCulling },
  { id: "scene", label: "Scene", filename: "Scene.md", content: scene },
  { id: "camera2d", label: "Camera2D", filename: "Camera2D.md", content: camera2d },
  { id: "camera-world-bounds", label: "Camera World Bounds", filename: "CameraWorldBounds.md", content: cameraWorldBounds },
  { id: "visible-objects", label: "Visible Objects", filename: "VisibleObjects.md", content: visibleObjects },
  { id: "dirty-versioning", label: "Dirty Versioning", filename: "DirtyVersioning.md", content: dirtyVersioning },
  { id: "render-order", label: "Render Order", filename: "RenderOrder.md", content: renderOrder },
  { id: "renderer2d", label: "Renderer2D", filename: "Renderer2D.md", content: renderer2d },
  { id: "renderer-parity", label: "Renderer Parity", filename: "RendererParity.md", content: rendererParity },
  { id: "renderer-stats", label: "Renderer Stats", filename: "RendererStats.md", content: rendererStats },
  { id: "render-mode", label: "Render Mode", filename: "RenderMode.md", content: renderMode },
  { id: "pipeline-architecture", label: "Pipeline Architecture", filename: "PipelineArchitecture.md", content: pipelineArchitecture },
  { id: "render-pipeline", label: "Render Pipeline", filename: "RenderPipeline.md", content: renderPipeline },
  { id: "webgl-availability", label: "WebGL Availability", filename: "WebGLAvailability.md", content: webGLAvailability },
  { id: "webgl-renderer", label: "WebGLRenderer2D", filename: "WebGLRenderer2D.md", content: webGLRenderer2D },
  { id: "webgl-performance", label: "WebGL Performance", filename: "WebGLPerformance.md", content: webGLPerformance },
  { id: "webgl-sprite-batching", label: "WebGL Sprite Batching", filename: "WebGLSpriteBatching.md", content: webGLSpriteBatching },
  { id: "webgl-texture-lifecycle", label: "WebGL Texture Lifecycle", filename: "WebGLTextureLifecycle.md", content: webGLTextureLifecycle },
  { id: "webgl-context-lifecycle", label: "WebGL Context Lifecycle", filename: "WebGLContextLifecycle.md", content: webGLContextLifecycle },
  { id: "webgl-float-buffer", label: "WebGLFloatBuffer", filename: "WebGLFloatBuffer.md", content: webGLFloatBuffer },
  { id: "webgl-buffer-uploader", label: "WebGLBufferUploader", filename: "WebGLBufferUploader.md", content: webGLBufferUploader },
  { id: "webgl-static-batch-cache", label: "WebGL Static Cache", filename: "WebGLStaticBatchCache.md", content: webGLStaticBatchCache },
  { id: "transform-matrix", label: "Transform Matrix", filename: "TransformMatrix.md", content: transformMatrix },
  { id: "group2d", label: "Group2D", filename: "Group2D.md", content: group2d },
  { id: "camera-controls", label: "CameraControls", filename: "CameraControls.md", content: cameraControls },
  { id: "basic-material", label: "BasicMaterial", filename: "BasicMaterial.md", content: basicMaterial },
  { id: "rect", label: "Rect", filename: "Rect.md", content: rect },
  { id: "circle", label: "Circle", filename: "Circle.md", content: circle },
  { id: "line", label: "Line", filename: "Line.md", content: line },
  { id: "polyline", label: "Polyline", filename: "Polyline.md", content: polyline },
  { id: "polygon", label: "Polygon", filename: "Polygon.md", content: polygon },
  { id: "shape-path", label: "ShapePath", filename: "ShapePath.md", content: shapePath },
  { id: "sprite-animation", label: "Sprite Animation", filename: "SpriteAnimation.md", content: spriteAnimation },
  { id: "text2d", label: "Text2D", filename: "Text2D.md", content: text2d },
  { id: "texture-atlas", label: "TextureAtlas", filename: "TextureAtlas.md", content: textureAtlas },
  { id: "texture-atlas-packer", label: "TextureAtlasPacker", filename: "TextureAtlasPacker.md", content: textureAtlasPacker },
  { id: "hit-testing", label: "Hit Testing", filename: "HitTesting.md", content: hitTesting },
  { id: "picking", label: "Picking", filename: "Picking.md", content: picking },
  { id: "selection", label: "Selection", filename: "Selection.md", content: selection },
  { id: "dragging", label: "Dragging", filename: "Dragging.md", content: dragging },
  { id: "resize-handles", label: "Resize Handles", filename: "ResizeHandles.md", content: resizeHandles },
  { id: "object-resize", label: "Object Resize", filename: "ObjectResize.md", content: objectResize },
  { id: "interaction-controller", label: "InteractionController", filename: "InteractionController.md", content: interactionController },
  { id: "keyboard-controller", label: "KeyboardController", filename: "KeyboardController.md", content: keyboardController }
];

import license from "../../docs/hi/License.md?raw";
import assetLoading from "../../docs/hi/AssetLoading.md?raw";
import canvas from "../../docs/hi/Canvas.md?raw";
import canvasApi from "../../docs/hi/Canvas-api.md?raw";
import canvasObjects from "../../docs/hi/Canvas-objects.md?raw";
import canvasCulling from "../../docs/hi/CanvasCulling.md?raw";
import canvasFocusedInstallAudit from "../../docs/hi/CanvasFocusedInstallAudit.md?raw";
import cdnBetaSmoke from "../../docs/hi/CDNBetaSmoke.md?raw";
import betaBrowserBugBash from "../../docs/hi/BetaBrowserBugBash.md?raw";
import examples from "../../docs/hi/Examples.md?raw";
import gettingStarted from "../../docs/hi/GettingStarted.md?raw";
import glossary from "../../docs/hi/Glossary.md?raw";
import v1Install from "../../docs/hi/V1Install.md?raw";
import scene from "../../docs/hi/Scene.md?raw";
import camera2d from "../../docs/hi/Camera2D.md?raw";
import cameraWorldBounds from "../../docs/hi/CameraWorldBounds.md?raw";
import visibleObjects from "../../docs/hi/VisibleObjects.md?raw";
import dirtyVersioning from "../../docs/hi/DirtyVersioning.md?raw";
import darkUIOverflowAudit from "../../docs/hi/DarkUIOverflowAudit.md?raw";
import docsMobileViewport from "../../docs/hi/DocsMobileViewport.md?raw";
import objectLifecycle from "../../docs/hi/ObjectLifecycle.md?raw";
import renderOrder from "../../docs/hi/RenderOrder.md?raw";
import renderer2d from "../../docs/hi/Renderer2D.md?raw";
import rendererParity from "../../docs/hi/RendererParity.md?raw";
import rendererStats from "../../docs/hi/RendererStats.md?raw";
import renderMode from "../../docs/hi/RenderMode.md?raw";
import pipelineArchitecture from "../../docs/hi/PipelineArchitecture.md?raw";
import renderPipeline from "../../docs/hi/RenderPipeline.md?raw";
import webglAvailability from "../../docs/hi/WebGLAvailability.md?raw";
import webglFocusedInstallAudit from "../../docs/hi/WebGLFocusedInstallAudit.md?raw";
import webglRenderer from "../../docs/hi/WebGLRenderer2D.md?raw";
import webglPerformance from "../../docs/hi/WebGLPerformance.md?raw";
import webglSpriteBatching from "../../docs/hi/WebGLSpriteBatching.md?raw";
import webglTextureLifecycle from "../../docs/hi/WebGLTextureLifecycle.md?raw";
import webglContextLifecycle from "../../docs/hi/WebGLContextLifecycle.md?raw";
import webglFloatBuffer from "../../docs/hi/WebGLFloatBuffer.md?raw";
import webglBufferUploader from "../../docs/hi/WebGLBufferUploader.md?raw";
import webglStaticBatchCache from "../../docs/hi/WebGLStaticBatchCache.md?raw";
import transformMatrix from "../../docs/hi/TransformMatrix.md?raw";
import group2d from "../../docs/hi/Group2D.md?raw";
import cameraControls from "../../docs/hi/CameraControls.md?raw";
import basicMaterial from "../../docs/hi/BasicMaterial.md?raw";
import rect from "../../docs/hi/Rect.md?raw";
import circle from "../../docs/hi/Circle.md?raw";
import line from "../../docs/hi/Line.md?raw";
import polyline from "../../docs/hi/Polyline.md?raw";
import polygon from "../../docs/hi/Polygon.md?raw";
import shapePath from "../../docs/hi/ShapePath.md?raw";
import showcaseDemo from "../../docs/hi/ShowcaseDemo.md?raw";
import raw2dMcpServerEntry from "../../docs/hi/Raw2DMCPServerEntry.md?raw";
import raw2dMcpSchemas from "../../docs/hi/Raw2DMCPSchemas.md?raw";
import raw2dMcpPluginConsumer from "../../docs/hi/Raw2DMCPPluginConsumer.md?raw";
import raw2dStudioShell from "../../docs/hi/Raw2DStudioShell.md?raw";
import raw2dStudioSceneFormat from "../../docs/hi/Raw2DStudioSceneFormat.md?raw";
import reactFiberBoundary from "../../docs/hi/ReactFiberBoundary.md?raw";
import reactRendererAPIAudit from "../../docs/hi/ReactRendererAPIAudit.md?raw";
import reactReconcilerModel from "../../docs/hi/ReactReconcilerModel.md?raw";
import spriteAnimation from "../../docs/hi/SpriteAnimation.md?raw";
import text2d from "../../docs/hi/Text2D.md?raw";
import textureAtlas from "../../docs/hi/TextureAtlas.md?raw";
import textureAtlasPacker from "../../docs/hi/TextureAtlasPacker.md?raw";
import hitTesting from "../../docs/hi/HitTesting.md?raw";
import umbrellaBetaInstallAudit from "../../docs/hi/UmbrellaBetaInstallAudit.md?raw";
import picking from "../../docs/hi/Picking.md?raw";
import selection from "../../docs/hi/Selection.md?raw";
import publicApi from "../../docs/hi/PublicAPI.md?raw";
import publicBetaHardeningPlan from "../../docs/hi/PublicBetaHardeningPlan.md?raw";
import productDocsSnippetAudit from "../../docs/hi/ProductDocsSnippetAudit.md?raw";
import reactAdapterVsFiber from "../../docs/hi/ReactAdapterVsFiber.md?raw";
import reactBetaInstallAudit from "../../docs/hi/ReactBetaInstallAudit.md?raw";
import dragging from "../../docs/hi/Dragging.md?raw";
import resizeHandles from "../../docs/hi/ResizeHandles.md?raw";
import objectResize from "../../docs/hi/ObjectResize.md?raw";
import interactionController from "../../docs/hi/InteractionController.md?raw";
import keyboardController from "../../docs/hi/KeyboardController.md?raw";
import type { ReadmeDoc } from "./ReadmePage.type";

export const readmeHinglishDocs: readonly ReadmeDoc[] = [
  { id: "getting-started", label: "Getting Started", filename: "hi/GettingStarted.md", content: gettingStarted },
  { id: "v1-install", label: "V1 Install", filename: "hi/V1Install.md", content: v1Install },
  { id: "public-api", label: "Public API", filename: "hi/PublicAPI.md", content: publicApi },
  {
    id: "public-beta-hardening-plan",
    label: "Public Beta Hardening",
    filename: "hi/PublicBetaHardeningPlan.md",
    content: publicBetaHardeningPlan
  },
  {
    id: "umbrella-beta-install-audit",
    label: "Umbrella Install Audit",
    filename: "hi/UmbrellaBetaInstallAudit.md",
    content: umbrellaBetaInstallAudit
  },
  {
    id: "canvas-focused-install-audit",
    label: "Canvas Focused Install",
    filename: "hi/CanvasFocusedInstallAudit.md",
    content: canvasFocusedInstallAudit
  },
  {
    id: "webgl-focused-install-audit",
    label: "WebGL Focused Install",
    filename: "hi/WebGLFocusedInstallAudit.md",
    content: webglFocusedInstallAudit
  },
  {
    id: "react-beta-install-audit",
    label: "React Beta Install",
    filename: "hi/ReactBetaInstallAudit.md",
    content: reactBetaInstallAudit
  },
  { id: "cdn-beta-smoke", label: "CDN Beta Smoke", filename: "hi/CDNBetaSmoke.md", content: cdnBetaSmoke },
  { id: "beta-browser-bug-bash", label: "Browser Bug Bash", filename: "hi/BetaBrowserBugBash.md", content: betaBrowserBugBash },
  { id: "docs-mobile-viewport", label: "Docs Mobile Viewport", filename: "hi/DocsMobileViewport.md", content: docsMobileViewport },
  { id: "dark-ui-overflow-audit", label: "Dark UI Overflow", filename: "hi/DarkUIOverflowAudit.md", content: darkUIOverflowAudit },
  {
    id: "product-docs-snippet-audit",
    label: "Product Docs Snippets",
    filename: "hi/ProductDocsSnippetAudit.md",
    content: productDocsSnippetAudit
  },
  { id: "examples", label: "Examples", filename: "hi/Examples.md", content: examples },
  { id: "showcase-demo", label: "Showcase Demo", filename: "hi/ShowcaseDemo.md", content: showcaseDemo },
  { id: "raw2d-mcp-server-entry", label: "MCP Server Entry", filename: "hi/Raw2DMCPServerEntry.md", content: raw2dMcpServerEntry },
  { id: "raw2d-mcp-schemas", label: "MCP Schemas", filename: "hi/Raw2DMCPSchemas.md", content: raw2dMcpSchemas },
  { id: "raw2d-mcp-plugin-consumer", label: "MCP Plugin Consumer", filename: "hi/Raw2DMCPPluginConsumer.md", content: raw2dMcpPluginConsumer },
  { id: "studio-shell", label: "Studio Shell", filename: "hi/Raw2DStudioShell.md", content: raw2dStudioShell },
  { id: "studio-scene-format", label: "Studio Scene Format", filename: "hi/Raw2DStudioSceneFormat.md", content: raw2dStudioSceneFormat },
  { id: "react-adapter-vs-fiber", label: "React Adapter Vs Fiber", filename: "hi/ReactAdapterVsFiber.md", content: reactAdapterVsFiber },
  { id: "react-fiber-boundary", label: "React Fiber Boundary", filename: "hi/ReactFiberBoundary.md", content: reactFiberBoundary },
  { id: "react-renderer-api-audit", label: "React Renderer API Audit", filename: "hi/ReactRendererAPIAudit.md", content: reactRendererAPIAudit },
  { id: "react-reconciler-model", label: "React Reconciler Model", filename: "hi/ReactReconcilerModel.md", content: reactReconcilerModel },
  { id: "glossary", label: "Glossary", filename: "hi/Glossary.md", content: glossary },
  { id: "license", label: "License", filename: "hi/License.md", content: license },
  { id: "asset-loading", label: "Asset Loading", filename: "hi/AssetLoading.md", content: assetLoading },
  { id: "canvas", label: "Canvas", filename: "hi/Canvas.md", content: canvas },
  { id: "canvas-api", label: "Canvas API", filename: "hi/Canvas-api.md", content: canvasApi },
  { id: "canvas-objects", label: "Canvas Objects", filename: "hi/Canvas-objects.md", content: canvasObjects },
  { id: "canvas-culling", label: "Canvas Culling", filename: "hi/CanvasCulling.md", content: canvasCulling },
  { id: "scene", label: "Scene", filename: "hi/Scene.md", content: scene },
  { id: "camera2d", label: "Camera2D", filename: "hi/Camera2D.md", content: camera2d },
  { id: "camera-world-bounds", label: "Camera World Bounds", filename: "hi/CameraWorldBounds.md", content: cameraWorldBounds },
  { id: "visible-objects", label: "Visible Objects", filename: "hi/VisibleObjects.md", content: visibleObjects },
  { id: "dirty-versioning", label: "Dirty Versioning", filename: "hi/DirtyVersioning.md", content: dirtyVersioning },
  { id: "object-lifecycle", label: "Object Lifecycle", filename: "hi/ObjectLifecycle.md", content: objectLifecycle },
  { id: "render-order", label: "Render Order", filename: "hi/RenderOrder.md", content: renderOrder },
  { id: "renderer2d", label: "Renderer2D", filename: "hi/Renderer2D.md", content: renderer2d },
  { id: "renderer-parity", label: "Renderer Parity", filename: "hi/RendererParity.md", content: rendererParity },
  { id: "renderer-stats", label: "Renderer Stats", filename: "hi/RendererStats.md", content: rendererStats },
  { id: "render-mode", label: "Render Mode", filename: "hi/RenderMode.md", content: renderMode },
  { id: "pipeline-architecture", label: "Pipeline Architecture", filename: "hi/PipelineArchitecture.md", content: pipelineArchitecture },
  { id: "render-pipeline", label: "Render Pipeline", filename: "hi/RenderPipeline.md", content: renderPipeline },
  { id: "webgl-availability", label: "WebGL Availability", filename: "hi/WebGLAvailability.md", content: webglAvailability },
  { id: "webgl-renderer", label: "WebGLRenderer2D", filename: "hi/WebGLRenderer2D.md", content: webglRenderer },
  { id: "webgl-performance", label: "WebGL Performance", filename: "hi/WebGLPerformance.md", content: webglPerformance },
  { id: "webgl-sprite-batching", label: "WebGL Sprite Batching", filename: "hi/WebGLSpriteBatching.md", content: webglSpriteBatching },
  { id: "webgl-texture-lifecycle", label: "WebGL Texture Lifecycle", filename: "hi/WebGLTextureLifecycle.md", content: webglTextureLifecycle },
  { id: "webgl-context-lifecycle", label: "WebGL Context Lifecycle", filename: "hi/WebGLContextLifecycle.md", content: webglContextLifecycle },
  { id: "webgl-float-buffer", label: "WebGLFloatBuffer", filename: "hi/WebGLFloatBuffer.md", content: webglFloatBuffer },
  { id: "webgl-buffer-uploader", label: "WebGLBufferUploader", filename: "hi/WebGLBufferUploader.md", content: webglBufferUploader },
  { id: "webgl-static-batch-cache", label: "WebGL Static Cache", filename: "hi/WebGLStaticBatchCache.md", content: webglStaticBatchCache },
  { id: "transform-matrix", label: "Transform Matrix", filename: "hi/TransformMatrix.md", content: transformMatrix },
  { id: "group2d", label: "Group2D", filename: "hi/Group2D.md", content: group2d },
  { id: "camera-controls", label: "CameraControls", filename: "hi/CameraControls.md", content: cameraControls },
  { id: "basic-material", label: "BasicMaterial", filename: "hi/BasicMaterial.md", content: basicMaterial },
  { id: "rect", label: "Rect", filename: "hi/Rect.md", content: rect },
  { id: "circle", label: "Circle", filename: "hi/Circle.md", content: circle },
  { id: "line", label: "Line", filename: "hi/Line.md", content: line },
  { id: "polyline", label: "Polyline", filename: "hi/Polyline.md", content: polyline },
  { id: "polygon", label: "Polygon", filename: "hi/Polygon.md", content: polygon },
  { id: "shape-path", label: "ShapePath", filename: "hi/ShapePath.md", content: shapePath },
  { id: "sprite-animation", label: "Sprite Animation", filename: "hi/SpriteAnimation.md", content: spriteAnimation },
  { id: "text2d", label: "Text2D", filename: "hi/Text2D.md", content: text2d },
  { id: "texture-atlas", label: "TextureAtlas", filename: "hi/TextureAtlas.md", content: textureAtlas },
  { id: "texture-atlas-packer", label: "TextureAtlasPacker", filename: "hi/TextureAtlasPacker.md", content: textureAtlasPacker },
  { id: "hit-testing", label: "Hit Testing", filename: "hi/HitTesting.md", content: hitTesting },
  { id: "picking", label: "Picking", filename: "hi/Picking.md", content: picking },
  { id: "selection", label: "Selection", filename: "hi/Selection.md", content: selection },
  { id: "dragging", label: "Dragging", filename: "hi/Dragging.md", content: dragging },
  { id: "resize-handles", label: "Resize Handles", filename: "hi/ResizeHandles.md", content: resizeHandles },
  { id: "object-resize", label: "Object Resize", filename: "hi/ObjectResize.md", content: objectResize },
  { id: "interaction-controller", label: "InteractionController", filename: "hi/InteractionController.md", content: interactionController },
  { id: "keyboard-controller", label: "KeyboardController", filename: "hi/KeyboardController.md", content: keyboardController }
];

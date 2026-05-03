import { boundsTopics } from "./DocBoundsTopics";
import { beginnerPathTopics } from "./DocBeginnerPathTopics";
import { benchmarkLimitationsTopics } from "./DocBenchmarkLimitationsTopics";
import { canvasCullingTopics } from "./DocCanvasCullingTopics";
import { coreTopics } from "./DocCoreTopics";
import { curveTopics } from "./DocCurveTopics";
import { exampleTopics } from "./DocExamplesTopics";
import { group2DTopics } from "./DocGroup2DTopics";
import { hitTestingTopics } from "./DocHitTestingTopics";
import { interactionPathTopics } from "./DocInteractionPathTopics";
import { interactionTopics } from "./DocInteractionTopics";
import { licenseTopics } from "./DocLicenseTopics";
import { mcpTopics } from "./DocMcpTopics";
import type { DocGroup, DocTopic } from "./DocPage.type";
import { docQaChecklistTopics } from "./DocQAChecklistTopics";
import { objectTopics } from "./DocObjectTopics";
import { pathTopics } from "./DocPathTopics";
import { pickingTopics } from "./DocPickingTopics";
import { publicApiTopics } from "./DocPublicApiTopics";
import { renderOrderTopics } from "./DocRenderOrderTopics";
import { rendererTopics } from "./DocRendererTopics";
import { rendererChoiceTopics } from "./DocRendererChoiceTopics";
import { rendererParityTopics } from "./DocRendererParityTopics";
import { renderListTopics } from "./DocRenderListTopics";
import { renderPipelineTopics } from "./DocRenderPipelineTopics";
import { setupTopics } from "./DocSetupTopics";
import { texturePathTopics } from "./DocTexturePathTopics";
import { transformTopics } from "./DocTransformTopics";
import { visibleObjectsTopics } from "./DocVisibleObjectsTopics";
import { webGLPerformanceTopics } from "./DocWebGLPerformanceTopics";
import { webGLBatcherTopics } from "./DocWebGLBatcherTopics";
import { webGLBatchingDetailsTopics } from "./DocWebGLBatchingDetailsTopics";
import { webGLBufferTopics } from "./DocWebGLBufferTopics";
import { webGLContextTopics } from "./DocWebGLContextTopics";
import { webGLDrawCallTopics } from "./DocWebGLDrawCallTopics";
import { webGLDebugOverlayTopics } from "./DocWebGLDebugOverlayTopics";
import { webGLPathTopics } from "./DocWebGLPathTopics";
import { webGLPipelineTopics } from "./DocWebGLPipelineTopics";
import { webGLRendererTopics } from "./DocWebGLRendererTopics";
import { webGLShaderTopics } from "./DocWebGLShaderTopics";
import { webGLVisualTestsTopics } from "./DocWebGLVisualTestsTopics";

export const docGroups: readonly DocGroup[] = [
  {
    id: "start-here",
    label: "Start Here",
    hiLabel: "Yahan Se Start",
    topics: [...setupTopics, ...beginnerPathTopics, ...publicApiTopics, ...exampleTopics, ...docQaChecklistTopics, ...licenseTopics]
  },
  {
    id: "scene-foundations",
    label: "Scene Foundations",
    hiLabel: "Scene Foundation",
    topics: [...coreTopics, ...group2DTopics, ...transformTopics, ...boundsTopics]
  },
  {
    id: "drawing-objects",
    label: "Drawing Objects",
    hiLabel: "Drawing Objects",
    topics: [...texturePathTopics, ...curveTopics, ...pathTopics, ...objectTopics]
  },
  {
    id: "render-flow",
    label: "Render Flow",
    hiLabel: "Render Flow",
    topics: [
      ...canvasCullingTopics,
      ...visibleObjectsTopics,
      ...renderOrderTopics,
      ...rendererTopics,
      ...rendererChoiceTopics,
      ...benchmarkLimitationsTopics,
      ...rendererParityTopics,
      ...renderPipelineTopics,
      ...renderListTopics
    ]
  },
  {
    id: "webgl-path",
    label: "WebGL Path",
    hiLabel: "WebGL Path",
    topics: [
      ...webGLPathTopics,
      ...webGLPipelineTopics,
      ...webGLBatcherTopics,
      ...webGLBatchingDetailsTopics,
      ...webGLBufferTopics,
      ...webGLShaderTopics,
      ...webGLDrawCallTopics,
      ...webGLDebugOverlayTopics,
      ...webGLRendererTopics,
      ...webGLContextTopics,
      ...webGLPerformanceTopics,
      ...webGLVisualTestsTopics
    ]
  },
  {
    id: "interaction-tools",
    label: "Interaction Tools",
    hiLabel: "Interaction Tools",
    topics: [...interactionPathTopics, ...hitTestingTopics, ...pickingTopics, ...interactionTopics]
  },
  {
    id: "ai-tools",
    label: "AI Tools",
    hiLabel: "AI Tools",
    topics: [...mcpTopics]
  }
];

export const topics: readonly DocTopic[] = docGroups.flatMap((group) => group.topics);

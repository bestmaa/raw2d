import { boundsTopics } from "./DocBoundsTopics";
import { beginnerPathTopics } from "./DocBeginnerPathTopics";
import { accessibilityTopics } from "./DocAccessibilityTopics";
import { apiFreezeTopics } from "./DocAPIFreezeTopics";
import { benchmarkLimitationsTopics } from "./DocBenchmarkLimitationsTopics";
import { canvasCullingTopics } from "./DocCanvasCullingTopics";
import { canvasQATopics } from "./DocCanvasQATopics";
import { cdnTopics } from "./DocCDNTopics";
import { changelogTopics } from "./DocChangelogTopics";
import { coreTopics } from "./DocCoreTopics";
import { consoleAuditTopics } from "./DocConsoleAuditTopics";
import { curveTopics } from "./DocCurveTopics";
import { exampleTopics } from "./DocExamplesTopics";
import { group2DTopics } from "./DocGroup2DTopics";
import { hitTestingTopics } from "./DocHitTestingTopics";
import { interactionPathTopics } from "./DocInteractionPathTopics";
import { interactionQATopics } from "./DocInteractionQATopics";
import { interactionTopics } from "./DocInteractionTopics";
import { installSmokeTopics } from "./DocInstallSmokeTopics";
import { licenseTopics } from "./DocLicenseTopics";
import { mcpTopics } from "./DocMcpTopics";
import { mcpReadinessTopics } from "./DocMCPReadinessTopics";
import { migrationTopics } from "./DocMigrationTopics";
import { pluginTopics } from "./DocPluginTopics";
import { postReleaseAuditTopics } from "./DocPostReleaseAuditTopics";
import { publishTopics } from "./DocPublishTopics";
import type { DocGroup, DocTopic } from "./DocPage.type";
import { docQaChecklistTopics } from "./DocQAChecklistTopics";
import { deployTopics } from "./DocDeployTopics";
import { objectTopics } from "./DocObjectTopics";
import { pathTopics } from "./DocPathTopics";
import { pickingTopics } from "./DocPickingTopics";
import { publicApiTopics } from "./DocPublicApiTopics";
import { reactTopics } from "./DocReactTopics";
import { reactReadinessTopics } from "./DocReactReadinessTopics";
import { renderOrderTopics } from "./DocRenderOrderTopics";
import { releaseTopics } from "./DocReleaseTopics";
import { releaseNotesTopics } from "./DocReleaseNotesTopics";
import { rendererTopics } from "./DocRendererTopics";
import { rendererChoiceTopics } from "./DocRendererChoiceTopics";
import { rendererParityTopics } from "./DocRendererParityTopics";
import { finalRendererParityTopics } from "./DocFinalRendererParityTopics";
import { renderListTopics } from "./DocRenderListTopics";
import { renderPipelineTopics } from "./DocRenderPipelineTopics";
import { setupTopics } from "./DocSetupTopics";
import { texturePathTopics } from "./DocTexturePathTopics";
import { transformTopics } from "./DocTransformTopics";
import { visibleObjectsTopics } from "./DocVisibleObjectsTopics";
import { webGLPerformanceTopics } from "./DocWebGLPerformanceTopics";
import { webGLQATopics } from "./DocWebGLQATopics";
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
    description: "Install, first render, examples, releases, and publish basics.",
    hiLabel: "Yahan Se Start",
    hiDescription: "Install, first render, examples, release, aur publish basics.",
    topics: [
      ...setupTopics,
      ...beginnerPathTopics,
      ...publicApiTopics,
      ...apiFreezeTopics,
      ...migrationTopics,
      ...releaseTopics,
      ...releaseNotesTopics,
      ...changelogTopics,
      ...postReleaseAuditTopics,
      ...installSmokeTopics,
      ...publishTopics,
      ...deployTopics,
      ...cdnTopics,
      ...consoleAuditTopics,
      ...accessibilityTopics,
      ...canvasQATopics,
      ...exampleTopics,
      ...docQaChecklistTopics,
      ...licenseTopics
    ]
  },
  {
    id: "scene-foundations",
    label: "Scene Foundations",
    description: "Scene graph, transforms, groups, bounds, and core object rules.",
    hiLabel: "Scene Foundation",
    hiDescription: "Scene graph, transform, groups, bounds, aur core object rules.",
    topics: [...coreTopics, ...group2DTopics, ...transformTopics, ...boundsTopics]
  },
  {
    id: "drawing-objects",
    label: "Drawing Objects",
    description: "Shapes, paths, textures, sprites, text, and object parameters.",
    hiLabel: "Drawing Objects",
    hiDescription: "Shapes, paths, textures, sprites, text, aur object parameters.",
    topics: [...texturePathTopics, ...curveTopics, ...pathTopics, ...objectTopics]
  },
  {
    id: "render-flow",
    label: "Render Flow",
    description: "Renderer choice, render lists, ordering, culling, and parity.",
    hiLabel: "Render Flow",
    hiDescription: "Renderer choice, render list, order, culling, aur parity.",
    topics: [
      ...canvasCullingTopics,
      ...visibleObjectsTopics,
      ...renderOrderTopics,
      ...rendererTopics,
      ...rendererChoiceTopics,
      ...benchmarkLimitationsTopics,
      ...rendererParityTopics,
      ...finalRendererParityTopics,
      ...renderPipelineTopics,
      ...renderListTopics
    ]
  },
  {
    id: "webgl-path",
    label: "WebGL Path",
    description: "Batching, buffers, shaders, draw calls, diagnostics, and tests.",
    hiLabel: "WebGL Path",
    hiDescription: "Batching, buffers, shaders, draw calls, diagnostics, aur tests.",
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
      ...webGLQATopics,
      ...webGLVisualTestsTopics
    ]
  },
  {
    id: "interaction-tools",
    label: "Interaction Tools",
    description: "Picking, selection, dragging, resize handles, and keyboard input.",
    hiLabel: "Interaction Tools",
    hiDescription: "Picking, selection, drag, resize handles, aur keyboard input.",
    topics: [...interactionPathTopics, ...hitTestingTopics, ...pickingTopics, ...interactionTopics, ...interactionQATopics]
  },
  {
    id: "ai-tools",
    label: "AI Tools",
    description: "MCP, plugin, skills, and AI-assisted Raw2D project workflows.",
    hiLabel: "AI Tools",
    hiDescription: "MCP, plugin, skills, aur AI-assisted Raw2D workflows.",
    topics: [...mcpTopics, ...mcpReadinessTopics, ...pluginTopics]
  },
  {
    id: "react-later",
    label: "React Later",
    description: "React bridge status and the future fiber-style package path.",
    hiLabel: "React Later",
    hiDescription: "React bridge status aur future fiber-style package path.",
    topics: [...reactTopics, ...reactReadinessTopics]
  }
];

export const topics: readonly DocTopic[] = docGroups.flatMap((group) => group.topics);

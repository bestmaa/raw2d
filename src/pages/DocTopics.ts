import { boundsTopics } from "./DocBoundsTopics";
import { beginnerPathTopics } from "./DocBeginnerPathTopics";
import { canvasCullingTopics } from "./DocCanvasCullingTopics";
import { coreTopics } from "./DocCoreTopics";
import { curveTopics } from "./DocCurveTopics";
import { exampleTopics } from "./DocExamplesTopics";
import { group2DTopics } from "./DocGroup2DTopics";
import { hitTestingTopics } from "./DocHitTestingTopics";
import { interactionPathTopics } from "./DocInteractionPathTopics";
import { interactionTopics } from "./DocInteractionTopics";
import { licenseTopics } from "./DocLicenseTopics";
import type { DocGroup, DocTopic } from "./DocPage.type";
import { docQaChecklistTopics } from "./DocQAChecklistTopics";
import { objectTopics } from "./DocObjectTopics";
import { pathTopics } from "./DocPathTopics";
import { pickingTopics } from "./DocPickingTopics";
import { publicApiTopics } from "./DocPublicApiTopics";
import { renderOrderTopics } from "./DocRenderOrderTopics";
import { rendererTopics } from "./DocRendererTopics";
import { rendererParityTopics } from "./DocRendererParityTopics";
import { renderPipelineTopics } from "./DocRenderPipelineTopics";
import { setupTopics } from "./DocSetupTopics";
import { texturePathTopics } from "./DocTexturePathTopics";
import { transformTopics } from "./DocTransformTopics";
import { visibleObjectsTopics } from "./DocVisibleObjectsTopics";
import { webGLPerformanceTopics } from "./DocWebGLPerformanceTopics";
import { webGLContextTopics } from "./DocWebGLContextTopics";
import { webGLPathTopics } from "./DocWebGLPathTopics";
import { webGLPipelineTopics } from "./DocWebGLPipelineTopics";
import { webGLRendererTopics } from "./DocWebGLRendererTopics";
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
      ...rendererParityTopics,
      ...renderPipelineTopics
    ]
  },
  {
    id: "webgl-path",
    label: "WebGL Path",
    hiLabel: "WebGL Path",
    topics: [
      ...webGLPathTopics,
      ...webGLPipelineTopics,
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
  }
];

export const topics: readonly DocTopic[] = docGroups.flatMap((group) => group.topics);

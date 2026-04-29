import { boundsTopics } from "./DocBoundsTopics";
import { canvasCullingTopics } from "./DocCanvasCullingTopics";
import { coreTopics } from "./DocCoreTopics";
import { curveTopics } from "./DocCurveTopics";
import { group2DTopics } from "./DocGroup2DTopics";
import { hitTestingTopics } from "./DocHitTestingTopics";
import { interactionTopics } from "./DocInteractionTopics";
import { licenseTopics } from "./DocLicenseTopics";
import type { DocGroup, DocTopic } from "./DocPage.type";
import { objectTopics } from "./DocObjectTopics";
import { pathTopics } from "./DocPathTopics";
import { pickingTopics } from "./DocPickingTopics";
import { renderOrderTopics } from "./DocRenderOrderTopics";
import { rendererTopics } from "./DocRendererTopics";
import { rendererParityTopics } from "./DocRendererParityTopics";
import { renderPipelineTopics } from "./DocRenderPipelineTopics";
import { setupTopics } from "./DocSetupTopics";
import { transformTopics } from "./DocTransformTopics";
import { visibleObjectsTopics } from "./DocVisibleObjectsTopics";
import { webGLPerformanceTopics } from "./DocWebGLPerformanceTopics";
import { webGLContextTopics } from "./DocWebGLContextTopics";
import { webGLRendererTopics } from "./DocWebGLRendererTopics";

export const docGroups: readonly DocGroup[] = [
  { id: "start", label: "Start", hiLabel: "Start", topics: [...setupTopics, ...licenseTopics] },
  { id: "core", label: "Core", hiLabel: "Core", topics: coreTopics },
  {
    id: "rendering",
    label: "Rendering",
    hiLabel: "Rendering",
    topics: [
      ...canvasCullingTopics,
      ...visibleObjectsTopics,
      ...renderOrderTopics,
      ...rendererTopics,
      ...rendererParityTopics,
      ...renderPipelineTopics
    ]
  },
  { id: "webgl", label: "WebGL", hiLabel: "WebGL", topics: [...webGLRendererTopics, ...webGLContextTopics, ...webGLPerformanceTopics] },
  { id: "scene-tools", label: "Scene Tools", hiLabel: "Scene Tools", topics: [...group2DTopics, ...transformTopics, ...boundsTopics] },
  { id: "interaction", label: "Interaction", hiLabel: "Interaction", topics: [...hitTestingTopics, ...pickingTopics, ...interactionTopics] },
  { id: "geometry", label: "Geometry", hiLabel: "Geometry", topics: [...curveTopics, ...pathTopics] },
  { id: "objects", label: "Objects", hiLabel: "Objects", topics: objectTopics }
];

export const topics: readonly DocTopic[] = docGroups.flatMap((group) => group.topics);

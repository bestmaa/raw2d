import { boundsTopics } from "./DocBoundsTopics";
import { canvasCullingTopics } from "./DocCanvasCullingTopics";
import { coreTopics } from "./DocCoreTopics";
import { curveTopics } from "./DocCurveTopics";
import { group2DTopics } from "./DocGroup2DTopics";
import { hitTestingTopics } from "./DocHitTestingTopics";
import { interactionTopics } from "./DocInteractionTopics";
import { licenseTopics } from "./DocLicenseTopics";
import type { DocTopic } from "./DocPage.type";
import { objectTopics } from "./DocObjectTopics";
import { pathTopics } from "./DocPathTopics";
import { pickingTopics } from "./DocPickingTopics";
import { renderOrderTopics } from "./DocRenderOrderTopics";
import { renderPipelineTopics } from "./DocRenderPipelineTopics";
import { setupTopics } from "./DocSetupTopics";
import { transformTopics } from "./DocTransformTopics";
import { visibleObjectsTopics } from "./DocVisibleObjectsTopics";
import { webGLPerformanceTopics } from "./DocWebGLPerformanceTopics";
import { webGLContextTopics } from "./DocWebGLContextTopics";
import { webGLRendererTopics } from "./DocWebGLRendererTopics";

export const topics: readonly DocTopic[] = [
  ...setupTopics,
  ...licenseTopics,
  ...coreTopics,
  ...canvasCullingTopics,
  ...visibleObjectsTopics,
  ...renderOrderTopics,
  ...renderPipelineTopics,
  ...webGLRendererTopics,
  ...webGLContextTopics,
  ...webGLPerformanceTopics,
  ...group2DTopics,
  ...transformTopics,
  ...boundsTopics,
  ...hitTestingTopics,
  ...pickingTopics,
  ...interactionTopics,
  ...curveTopics,
  ...pathTopics,
  ...objectTopics
];

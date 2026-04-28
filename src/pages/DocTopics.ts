import { boundsTopics } from "./DocBoundsTopics";
import { canvasCullingTopics } from "./DocCanvasCullingTopics";
import { coreTopics } from "./DocCoreTopics";
import { curveTopics } from "./DocCurveTopics";
import { hitTestingTopics } from "./DocHitTestingTopics";
import { interactionTopics } from "./DocInteractionTopics";
import type { DocTopic } from "./DocPage.type";
import { objectTopics } from "./DocObjectTopics";
import { pathTopics } from "./DocPathTopics";
import { pickingTopics } from "./DocPickingTopics";
import { setupTopics } from "./DocSetupTopics";
import { transformTopics } from "./DocTransformTopics";
import { visibleObjectsTopics } from "./DocVisibleObjectsTopics";

export const topics: readonly DocTopic[] = [
  ...setupTopics,
  ...coreTopics,
  ...canvasCullingTopics,
  ...visibleObjectsTopics,
  ...transformTopics,
  ...boundsTopics,
  ...hitTestingTopics,
  ...pickingTopics,
  ...interactionTopics,
  ...curveTopics,
  ...pathTopics,
  ...objectTopics
];

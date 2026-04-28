import { boundsTopics } from "./DocBoundsTopics";
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

export const topics: readonly DocTopic[] = [
  ...setupTopics,
  ...coreTopics,
  ...transformTopics,
  ...boundsTopics,
  ...hitTestingTopics,
  ...pickingTopics,
  ...interactionTopics,
  ...curveTopics,
  ...pathTopics,
  ...objectTopics
];

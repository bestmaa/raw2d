import { createBoundsDemo } from "./BoundsDemo";
import { createCircleDemo } from "./CircleDemo";
import { createLineDemo } from "./LineDemo";
import { createOriginDemo } from "./OriginDemo";
import { createRectDemo } from "./RectDemo";
import { createSpriteDemo } from "./SpriteDemo";
import { createText2DDemo } from "./Text2DDemo";

const demoIds = [
  "rect",
  "circle",
  "line",
  "text2d",
  "sprite",
  "origin",
  "origin-keywords",
  "origin-rect",
  "origin-custom",
  "origin-defaults",
  "bounds",
  "bounds-rectangle",
  "bounds-local",
  "bounds-world",
  "bounds-sprite",
  "bounds-text2d"
] as const;

export function hasDemoId(demoId: string): boolean {
  return demoIds.includes(demoId as (typeof demoIds)[number]);
}

export function createDemoForId(demoId: string): HTMLElement | null {
  if (demoId === "rect") {
    return createRectDemo();
  }

  if (demoId === "circle") {
    return createCircleDemo();
  }

  if (demoId === "line") {
    return createLineDemo();
  }

  if (demoId === "text2d" || demoId === "bounds-text2d") {
    return createText2DDemo();
  }

  if (demoId === "sprite" || demoId === "bounds-sprite") {
    return createSpriteDemo();
  }

  if (demoId === "origin" || demoId === "origin-keywords") {
    return createOriginDemo({ variant: "keywords" });
  }

  if (demoId === "origin-rect") {
    return createOriginDemo({ variant: "rect" });
  }

  if (demoId === "origin-custom") {
    return createOriginDemo({ variant: "custom" });
  }

  if (demoId === "origin-defaults") {
    return createOriginDemo({ variant: "defaults" });
  }

  if (demoId === "bounds" || demoId === "bounds-world") {
    return createBoundsDemo({ variant: "world" });
  }

  if (demoId === "bounds-rectangle") {
    return createBoundsDemo({ variant: "rectangle" });
  }

  if (demoId === "bounds-local") {
    return createBoundsDemo({ variant: "local" });
  }

  return null;
}

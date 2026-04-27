import type { DocTopic } from "./DocPage.type";

export const boundsTopics: readonly DocTopic[] = [
  {
    id: "bounds",
    label: "Bounds",
    title: "Bounds",
    description: "Bounds describe an object's rectangle for culling, hit testing, selection, and future resize tools.",
    sections: [
      {
        title: "Rectangle",
        body: "Rectangle is the basic bounds data type.",
        code: `const bounds = new Rectangle({
  x: 20,
  y: 40,
  width: 120,
  height: 80
});

bounds.containsPoint({ x: 60, y: 70 });
bounds.intersects(otherBounds);`
      },
      {
        title: "Local Bounds",
        body: "Local bounds describe object size before x/y, scale, rotation, and origin are applied.",
        code: `const rect = new Rect({ x: 100, y: 80, width: 120, height: 80 });
const localBounds = getRectLocalBounds(rect);

// x: 0, y: 0, width: 120, height: 80`
      },
      {
        title: "World Bounds",
        body: "World bounds apply transform and origin, then return an axis-aligned Rectangle.",
        code: `rect.setOrigin("center");
rect.rotation = Math.PI / 4;

const worldBounds = getWorldBounds({
  object: rect,
  localBounds: getRectLocalBounds(rect)
});`
      },
      {
        title: "Sprite Bounds",
        body: "Sprite has its own package-level bounds helpers.",
        code: `const localBounds = getSpriteLocalBounds(sprite);
const worldBounds = getSpriteWorldBounds(sprite);`
      },
      {
        title: "Text2D Bounds",
        body: "Text measurement needs a CanvasRenderingContext2D because browser text metrics come from canvas.",
        code: `const localBounds = measureText2DLocalBounds({ context, text });
const worldBounds = measureText2DWorldBounds({ context, text });`
      }
    ]
  }
];

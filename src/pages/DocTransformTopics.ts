import type { DocTopic } from "./DocPage.type";

export const transformTopics: readonly DocTopic[] = [
  {
    id: "origin",
    label: "Origin",
    title: "Origin",
    description: "Origin controls which point of an object is placed at x/y and used for rotation or scale.",
    sections: [
      {
        title: "Origin Keywords",
        body: "Use readable keywords for common object anchors.",
        code: `origin: "top-left"
origin: "top"
origin: "top-right"
origin: "left"
origin: "center"
origin: "right"
origin: "bottom-left"
origin: "bottom"
origin: "bottom-right"`
      },
      {
        title: "Use With Rect Or Sprite",
        body: "Center origin means x/y points at the middle of the object.",
        code: `const rect = new Rect({
  x: 300,
  y: 180,
  width: 120,
  height: 80,
  origin: "center"
});

rect.rotation = Math.PI / 4;`
      },
      {
        title: "Custom Origin",
        body: "Use normalized x/y values when a keyword is not enough.",
        code: `sprite.setOrigin({ x: 0.25, y: 0.75 });

// x: 0 is left, 0.5 is center, 1 is right.
// y: 0 is top, 0.5 is center, 1 is bottom.`
      },
      {
        title: "Defaults",
        body: "Rect, Sprite, Line, and Text2D default to top-left. Circle defaults to center.",
        code: `new Rect({ x: 20, y: 20, width: 80, height: 40 });
new Circle({ x: 120, y: 80, radius: 40 });`
      }
    ]
  }
];

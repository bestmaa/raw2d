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
        liveDemoId: "origin-keywords",
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
        liveDemoId: "origin-rect",
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
        liveDemoId: "origin-custom",
        code: `sprite.setOrigin({ x: 0.25, y: 0.75 });

// x: 0 is left, 0.5 is center, 1 is right.
// y: 0 is top, 0.5 is center, 1 is bottom.`
      },
      {
        title: "Defaults",
        body: "Rect, Sprite, Line, and Text2D default to top-left. Circle defaults to center.",
        liveDemoId: "origin-defaults",
        code: `new Rect({ x: 20, y: 20, width: 80, height: 40 });
new Circle({ x: 120, y: 80, radius: 40 });`
      }
    ]
  },
  {
    id: "transform-matrix",
    label: "Transform Matrix",
    title: "Transform Matrix",
    description: "Object2D stores cached local and world matrices so renderers, bounds, hit testing, and future WebGL share the same transform data.",
    sections: [
      {
        title: "Why It Matters",
        body: "Matrix caching keeps transform math centralized. When x, y, rotation, scale, or origin changes, Object2D marks its matrix dirty and recalculates only when needed.",
        code: `rect.x = 120;
rect.rotation = 0.4;

rect.updateMatrix();
const localMatrix = rect.getLocalMatrix();`
      },
      {
        title: "World Matrix",
        body: "Use updateWorldMatrix with a parent matrix when an object is inside a Group2D. RenderPipeline does this automatically while building render items.",
        code: `group.updateWorldMatrix();
rect.updateWorldMatrix(group.getWorldMatrix());

const worldMatrix = rect.getWorldMatrix();`
      },
      {
        title: "Dirty State",
        body: "Dirty state is useful for debugging and future performance tools. It shows whether local or world matrix data must be recalculated.",
        code: `console.log(rect.getMatrixState());

rect.setPosition(200, 140);
console.log(rect.getMatrixState());`
      },
      {
        title: "Render Pipeline",
        body: "Each RenderItem stores localMatrix and worldMatrix snapshots. Canvas can draw with local matrices today; WebGL can use world matrices later for buffers and shaders.",
        code: `const renderList = raw2dCanvas.createRenderList(scene, camera);
const item = renderList.getFlatItems()[0];

console.log(item.localMatrix);
console.log(item.worldMatrix);`
      },
      {
        title: "Direct Matrix Use",
        body: "Matrix3 is public for engine builders who need custom transforms, custom bounds, or future renderer experiments.",
        code: `const matrix = new Matrix3().compose(100, 80, 0.5, 2, 2);
const point = matrix.transformPoint({ x: 10, y: 20 });`
      }
    ]
  }
];

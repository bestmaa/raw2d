import type { DocTopic } from "./DocPage.type";

export const reactReconcilerTopics: readonly DocTopic[] = [
  {
    id: "react-adapter-vs-fiber",
    label: "Adapter Vs Fiber",
    title: "React Adapter Vs Future Fiber",
    description: "Use the current simple React bridge now, and reserve Fiber for deeper reconciliation later.",
    sections: [
      {
        title: "Use Current Adapter",
        body: "raw2d-react is the current small bridge for examples, simple apps, and explicit props.",
        code: `import { Raw2DCanvas, RawRect } from "raw2d-react";

<Raw2DCanvas renderer="canvas" width={800} height={480}>
  <RawRect x={80} y={80} width={160} height={96} fillColor="#35c2ff" />
</Raw2DCanvas>;`
      },
      {
        title: "Future Fiber",
        body: "raw2d-react-fiber should wait for stable lifecycle hooks, host nodes, and commit batching.",
        code: `<Raw2DCanvas renderer="webgl" width={800} height={480}>
  <rawScene>
    <rawRect x={80} y={80} width={160} height={96} />
    <rawSprite x={320} y={96} texture={texture} />
  </rawScene>
</Raw2DCanvas>`
      }
    ]
  },
  {
    id: "react-reconciler-model",
    label: "Reconciler Model",
    title: "React Reconciler Model",
    description: "Map JSX elements to adapter host nodes, Raw2D objects, parents, props, and cleanup.",
    sections: [
      {
        title: "Host Node",
        body: "The React package should keep a small host node that points to a normal Raw2D object.",
        code: `interface Raw2DHostNode {
  readonly id: string;
  readonly type: string;
  readonly object: Object2D | Scene | Camera2D;
  readonly propsVersion: number;
}`
      },
      {
        title: "Parenting",
        body: "Append and remove should use Scene and Group2D public APIs.",
        code: `scene.add(rect);
scene.remove(rect);
group.add(sprite);
group.remove(sprite);`
      },
      {
        title: "Props",
        body: "Props map to public setters or fields. Private renderer fields stay off limits.",
        code: `rawRect props -> Rect.setPosition, Rect.setSize
rawSprite props -> Sprite texture/frame/size setters
rawText2D props -> Text2D text/font/material setters`
      },
      {
        title: "Commit",
        body: "Batch React commits into one render request.",
        code: `commit props -> mark object dirty -> schedule render -> renderer.render(scene, camera)`
      }
    ]
  }
];

import type { DocTopic } from "./DocPage.type";

export const reactReconcilerTopics: readonly DocTopic[] = [
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

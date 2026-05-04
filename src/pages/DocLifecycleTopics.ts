import type { DocTopic } from "./DocPage.type";

export const lifecycleTopics: readonly DocTopic[] = [
  {
    id: "object-lifecycle",
    label: "Object Lifecycle",
    title: "Object Lifecycle",
    description: "Track attach, detach, and dispose ownership for scenes, groups, and future adapters.",
    sections: [
      {
        title: "Automatic Scene Hooks",
        body: "Scene and Group2D call lifecycle helpers when objects are added, removed, or cleared.",
        code: `const scene = new Scene();
const rect = new Rect({ width: 120, height: 80 });

scene.add(rect);
getObject2DLifecycleState(rect).parent === scene;

scene.remove(rect);
getObject2DLifecycleState(rect).parent === null;`
      },
      {
        title: "Adapter Ownership",
        body: "Future React Fiber or MCP adapters can use the same public lifecycle helpers.",
        code: `const parent = { id: "react-root", name: "Raw2D React root" };

attachObject2D({ object: rect, parent });
detachObject2D({ object: rect, parent });
disposeObject2D(rect);`
      },
      {
        title: "Renderer Boundary",
        body: "Lifecycle is ownership data. Renderers still only draw scenes and should not own adapter state.",
        code: `renderer.render(scene, camera);`
      }
    ]
  }
];

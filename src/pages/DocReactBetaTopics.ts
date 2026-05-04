import type { DocTopic } from "./DocPage.type";

export const reactBetaTopics: readonly DocTopic[] = [
  {
    id: "react-beta-guide",
    label: "React Beta Guide",
    title: "React Beta Guide",
    description: "Use the current raw2d-react bridge now, and keep future Fiber expectations separate.",
    sections: [
      {
        title: "Current Adapter",
        body: "raw2d-react is the current simple bridge. It gives React components for Raw2D objects without changing core packages.",
        code: `npm install raw2d raw2d-react react react-dom`
      },
      {
        title: "Use It For Small Scenes",
        body: "Use the current adapter for examples, dashboards, tools, and small or medium React scenes where simple props are enough.",
        code: `import { Raw2DCanvas, RawRect } from "raw2d-react";

<Raw2DCanvas renderer="canvas" width={800} height={480}>
  <RawRect x={80} y={80} width={160} height={96} fillColor="#35c2ff" />
</Raw2DCanvas>;`
      },
      {
        title: "Fiber Is Later",
        body: "A Fiber-style package should be separate and wait until Raw2D object lifecycle, renderer APIs, and examples are stable.",
        code: `raw2d-react        current bridge
raw2d-react-fiber  future custom reconciler
raw2d-core         stays React-free
raw2d-canvas       stays React-free
raw2d-webgl        stays React-free`
      },
      {
        title: "Do Not Hide Renderers",
        body: "React should still expose renderer choice. Users must know whether Canvas or WebGL is drawing the scene.",
        code: `<Raw2DCanvas renderer="canvas" />
<Raw2DCanvas renderer="webgl" fallbackToCanvas />`
      },
      {
        title: "Public API Only",
        body: "React adapters must wrap public Raw2D APIs and avoid private batch buffers, private renderer caches, or hidden scene mutation.",
        code: `Allowed: scene.add(object), renderer.render(scene, camera)
Avoid: private buffers, private texture caches, hidden renderer selection`
      }
    ]
  }
];

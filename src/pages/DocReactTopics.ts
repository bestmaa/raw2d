import type { DocTopic } from "./DocPage.type";

export const reactTopics: readonly DocTopic[] = [
  {
    id: "react-package-design",
    label: "React Package Design",
    title: "React Package Design",
    description: "Plan raw2d-react as a separate JSX bridge without changing Raw2D core APIs.",
    sections: [
      {
        title: "Goal",
        body: "React support should let users describe Raw2D scenes with JSX while keeping Raw2D fully usable without React.",
        code: `<Raw2DCanvas renderer="webgl" width={800} height={480}>
  <rawScene>
    <rawCamera x={0} y={0} zoom={1} />
    <rawRect x={80} y={80} width={160} height={96} fillColor="#35c2ff" />
  </rawScene>
</Raw2DCanvas>`
      },
      {
        title: "Package Boundary",
        body: "raw2d-react should depend on Raw2D packages. Raw2D runtime packages must not depend on React.",
        code: `raw2d-core   -> no React
raw2d-canvas -> no React
raw2d-webgl  -> no React
raw2d-react  -> owns JSX bridge`
      },
      {
        title: "Core API Rule",
        body: "The React bridge should wrap public classes and properties only. It should not require renderer internals or private object fields.",
        code: `Allowed:
- new Scene()
- new Camera2D()
- new Canvas()
- new WebGLRenderer2D()
- new Rect()

Avoid:
- private renderer caches
- private batch buffers
- hidden scene mutations`
      },
      {
        title: "Renderer Choice",
        body: "The JSX wrapper can provide a default, but users should still be able to choose Canvas or WebGL explicitly.",
        code: `<Raw2DCanvas renderer="canvas" />
<Raw2DCanvas renderer="webgl" />`
      },
      {
        title: "First Version Boundary",
        body: "The first React package should focus on lifecycle and scene mapping. Physics, ECS, plugins, and hidden renderer rewrites stay out.",
        code: `First:
- create objects
- update props
- remove objects
- render on changes

Later:
- hooks
- suspense-friendly loaders
- advanced interaction helpers`
      }
    ]
  }
];

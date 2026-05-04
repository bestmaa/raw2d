import type { DocTopic } from "./DocPage.type";

export const reactTopics: readonly DocTopic[] = [
  {
    id: "react-package",
    label: "React Package",
    title: "React Package",
    description: "Use raw2d-react to mount Raw2D in React without adding React to core renderer packages.",
    sections: [
      {
        title: "Install",
        body: "Install Raw2D, the React bridge, and React runtime packages together.",
        code: `npm install raw2d raw2d-react react react-dom`
      },
      {
        title: "Basic Canvas",
        body: "Raw2DCanvas owns the canvas element. Child primitives add Raw2D objects to the scene and request a render.",
        code: `import { Raw2DCanvas, RawRect } from "raw2d-react";

export function App() {
  return (
    <Raw2DCanvas renderer="canvas" width={800} height={480} backgroundColor="#10141c">
      <RawRect x={80} y={80} width={160} height={96} fillColor="#35c2ff" />
    </Raw2DCanvas>
  );
}`
      },
      {
        title: "Primitives",
        body: "The first bridge exposes Rect, Circle, Line, Sprite, and Text2D component wrappers.",
        code: `<RawRect x={80} y={80} width={160} height={96} fillColor="#35c2ff" />
<RawCircle x={320} y={128} radius={48} fillColor="#f45b69" />
<RawLine x={80} y={240} endX={260} endY={0} strokeColor="#f5f7fb" lineWidth={4} />
<RawText2D x={80} y={320} text="Raw2D React" font="32px sans-serif" />`
      },
      {
        title: "Sprite",
        body: "RawSprite takes an existing Raw2D Texture so asset loading stays explicit.",
        code: `import { Texture } from "raw2d";
import { RawSprite } from "raw2d-react";

const texture = new Texture({ source: image, width: 64, height: 64 });

<RawSprite texture={texture} x={420} y={96} width={64} height={64} />;`
      }
    ]
  },
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
  },
  {
    id: "react-jsx-mapping",
    label: "JSX Mapping",
    title: "JSX Mapping",
    description: "Map React JSX elements to Raw2D scene, camera, renderer, objects, and material rules.",
    sections: [
      {
        title: "Renderer",
        body: "Raw2DCanvas should own the canvas element and create the selected renderer explicitly.",
        code: `<Raw2DCanvas renderer="canvas" width={800} height={480} />
<Raw2DCanvas renderer="webgl" width={800} height={480} />`
      },
      {
        title: "Scene And Camera",
        body: "Scene and camera stay explicit so the React API teaches the same structure as the low-level Raw2D API.",
        code: `<Raw2DCanvas renderer="webgl">
  <rawScene>
    <rawCamera x={0} y={0} zoom={1} />
  </rawScene>
</Raw2DCanvas>`
      },
      {
        title: "Objects",
        body: "Object tags should use a raw prefix to avoid HTML conflicts while staying close to class names.",
        code: `<rawRect x={80} y={80} width={160} height={96} fillColor="#35c2ff" />
<rawCircle x={320} y={130} radius={48} fillColor="#facc15" />
<rawLine x={80} y={240} startX={0} startY={0} endX={260} endY={0} />
<rawText2D x={80} y={320} text="Raw2D" font="32px sans-serif" />`
      },
      {
        title: "Materials",
        body: "The first bridge can create BasicMaterial from common style props. Advanced material objects can be added after the core JSX mapping is stable.",
        code: `<rawRect
  fillColor="#35c2ff"
  strokeColor="#f5f7fb"
  lineWidth={2}
/>`
      },
      {
        title: "Identity And Updates",
        body: "React keys should map to stable Raw2D object instances. Prop updates should mutate public properties or call public methods only.",
        code: `<rawRect key="card-a" x={80} y={80} width={160} height={96} />`
      }
    ]
  },
  {
    id: "react-fiber-boundary",
    label: "Fiber Boundary",
    title: "React Fiber Boundary",
    description: "Define what the future Fiber-style package owns and what must stay in Raw2D core.",
    sections: [
      {
        title: "Boundary",
        body: "The future Fiber package should be a separate adapter. Raw2D core, Canvas, and WebGL packages stay React-free.",
        code: `React JSX -> raw2d-react-fiber -> Raw2D public API -> Renderer`
      },
      {
        title: "Package Scope",
        body: "raw2d-react remains the simple bridge. raw2d-react-fiber can become the custom reconciler once core lifecycle APIs are stable.",
        code: `raw2d-react        current simple bridge
raw2d-react-fiber  future reconciler
raw2d-core         no React dependency
raw2d-canvas       no React dependency
raw2d-webgl        no React dependency`
      },
      {
        title: "Adapter Owns",
        body: "The adapter may create objects, update props, attach objects to Scene, render after commits, and clean up owned references.",
        code: `<Raw2DCanvas renderer="webgl" width={800} height={480}>
  <rawRect x={80} y={80} width={160} height={96} fillColor="#35c2ff" />
  <rawCircle x={320} y={128} radius={48} fillColor="#facc15" />
</Raw2DCanvas>`
      },
      {
        title: "Non-Goals",
        body: "The Fiber package should not hide renderer choice, rewrite the scene graph, or depend on private renderer caches.",
        code: `Do not add:
- hidden Canvas/WebGL choice
- private batch buffer mutation
- physics, ECS, WASM, or plugin system
- required React dependency for non-React users`
      }
    ]
  },
  {
    id: "react-renderer-api-audit",
    label: "Renderer API Audit",
    title: "React Renderer API Audit",
    description: "Audit the public renderer surface a future Fiber adapter can use without touching internals.",
    sections: [
      {
        title: "Result",
        body: "Renderer APIs are stable enough for planning. A real Fiber adapter still needs object lifecycle hooks before implementation.",
        code: `Current: JSX adapter can call public renderer APIs.
Needed: stable object attach/detach/update hooks.
Avoid: private renderer cache or batch buffer access.`
      },
      {
        title: "Stable Surface",
        body: "React can call the same explicit APIs as vanilla Raw2D users.",
        code: `scene.add(object);
scene.remove(object);
renderer.render(scene, camera);
renderer.setSize(width, height);
renderer.clear();
renderer.dispose();`
      },
      {
        title: "Reconciliation Needs",
        body: "The adapter should own the React-to-Raw2D instance map and update public fields after React commits.",
        code: `create instance once
update props through public fields
attach or detach from Scene/Group2D
request render after commit
cleanup owned resources on unmount`
      },
      {
        title: "Gap",
        body: "Formal object lifecycle hooks are the missing piece. They should be core APIs, not React-only APIs.",
        code: `object.onAttach(parent);
object.onDetach(parent);
object.dispose();
object.markDirty();`
      }
    ]
  }
];

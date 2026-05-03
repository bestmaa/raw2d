import type { DocTopic } from "./DocPage.type";

export const setupTopics: readonly DocTopic[] = [
  {
    id: "setup",
    label: "Install / Setup",
    title: "Install / Setup",
    description: "Install Raw2D and render the first scene with Canvas or WebGL.",
    sections: [
      {
        title: "Recommended NPM Install",
        body: "Use the umbrella package first. It re-exports the stable public API from the focused packages.",
        code: `npm install raw2d`
      },
      {
        title: "First Canvas Render",
        body: "Canvas is the complete reference renderer. Create a scene, add an object, then render with a camera.",
        code: `<canvas id="raw2d-canvas"></canvas>

import { BasicMaterial, Camera2D, Canvas, Rect, Scene } from "raw2d";

const canvasElement = document.querySelector<HTMLCanvasElement>("#raw2d-canvas");

if (!canvasElement) {
  throw new Error("Canvas element not found.");
}

const raw2dCanvas = new Canvas({
  canvas: canvasElement,
  width: 800,
  height: 600,
  backgroundColor: "#10141c"
});
const scene = new Scene();
const camera = new Camera2D();

scene.add(new Rect({
  x: 100,
  y: 80,
  width: 180,
  height: 100,
  material: new BasicMaterial({ fillColor: "#35c2ff" })
}));

raw2dCanvas.render(scene, camera);`
      },
      {
        title: "Switch To WebGL",
        body: "The same scene and camera can render through WebGLRenderer2D when the object types are supported.",
        code: `import { WebGLRenderer2D } from "raw2d";

const webglRenderer = new WebGLRenderer2D({
  canvas: canvasElement,
  width: 800,
  height: 600,
  backgroundColor: "#10141c"
});

webglRenderer.render(scene, camera);
console.log(webglRenderer.getStats());`
      },
      {
        title: "Safe WebGL Fallback",
        body: "Use isWebGL2Available when WebGL should be preferred but Canvas must still work on devices without WebGL2.",
        code: `import { Canvas, WebGLRenderer2D, isWebGL2Available } from "raw2d";
import type { Renderer2DLike } from "raw2d";

const renderer: Renderer2DLike = isWebGL2Available({ canvas: canvasElement })
  ? new WebGLRenderer2D({ canvas: canvasElement })
  : new Canvas({ canvas: canvasElement });

renderer.render(scene, camera);`
      },
      {
        title: "Focused Package Install",
        body: "Advanced users can install only the modules they need.",
        code: `npm install raw2d-core raw2d-canvas raw2d-webgl raw2d-sprite raw2d-interaction

import { Camera2D, Rect, Scene } from "raw2d-core";
import { Canvas } from "raw2d-canvas";
import { WebGLRenderer2D } from "raw2d-webgl";
import { Sprite, TextureLoader } from "raw2d-sprite";
import { startObjectDrag } from "raw2d-interaction";`
      },
      {
        title: "CDN Usage",
        body: "Use the UMD build directly in a browser when you do not want a bundler.",
        code: `<script src="https://cdn.jsdelivr.net/npm/raw2d@0.5.13/dist/raw2d.umd.cjs"></script>

<script>
  const { BasicMaterial, Camera2D, Canvas, Rect, Scene } = Raw2D;
</script>`
      },
      {
        title: "Local Raw2D Development",
        body: "Use this only when working on the Raw2D source repository itself.",
        code: `npm install
npm run dev

http://localhost:5174/doc`
      }
    ]
  }
];

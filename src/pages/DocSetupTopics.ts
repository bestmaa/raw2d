import type { DocTopic } from "./DocPage.type";

export const setupTopics: readonly DocTopic[] = [
  {
    id: "setup",
    label: "Install / Setup",
    title: "Install / Setup",
    description: "Install Raw2D from npm or use the CDN build in a browser.",
    sections: [
      {
        title: "Recommended NPM Install",
        body: "Use the umbrella package first. It exports the stable public Raw2D API.",
        code: `npm install raw2d`
      },
      {
        title: "Use From NPM",
        body: "Import the renderer, scene, camera, objects, and materials from raw2d.",
        code: `import { BasicMaterial, Camera2D, Canvas, Rect, Scene } from "raw2d";

const raw2dCanvas = new Canvas({ canvas: canvasElement });
const scene = new Scene();
const camera = new Camera2D();

scene.add(new Rect({
  x: 100,
  y: 80,
  width: 120,
  height: 80,
  material: new BasicMaterial({ fillColor: "#f45b69" })
}));

raw2dCanvas.render(scene, camera);`
      },
      {
        title: "Focused Package Install",
        body: "Advanced users can install only the modules they need.",
        code: `npm install raw2d-core raw2d-canvas raw2d-sprite raw2d-interaction

import { Camera2D, Rect, Scene } from "raw2d-core";
import { Canvas } from "raw2d-canvas";
import { Sprite, TextureLoader } from "raw2d-sprite";
import { startObjectDrag } from "raw2d-interaction";`
      },
      {
        title: "CDN Usage",
        body: "Use the UMD build directly in a browser when you do not want a bundler.",
        code: `<script src="https://cdn.jsdelivr.net/npm/raw2d@0.1.1/dist/raw2d.umd.cjs"></script>

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

import type { DocTopic } from "./DocPage.type";

export const beginnerPathTopics: readonly DocTopic[] = [
  {
    id: "beginner-path",
    label: "Beginner Path",
    title: "Beginner Path",
    description: "A practical Raw2D learning path from install to Canvas, scene objects, texture, examples, Studio, and WebGL.",
    sections: [
      {
        title: "1. Install",
        body: "Start with the umbrella package while learning. Focused packages can come later when bundle control matters.",
        code: `npm install raw2d`
      },
      {
        title: "2. Own The Canvas Element",
        body: "Your app owns the DOM. Raw2D receives an HTMLCanvasElement and only renders into it.",
        code: `<canvas id="raw2d-canvas"></canvas>`
      },
      {
        title: "3. Create Canvas Renderer",
        body: "Canvas is the correctness-first renderer. Learn this path before switching to WebGL.",
        code: `import { Canvas } from "raw2d";

const canvasElement = document.querySelector<HTMLCanvasElement>("#raw2d-canvas");

if (!canvasElement) {
  throw new Error("Canvas element not found.");
}

const renderer = new Canvas({
  canvas: canvasElement,
  width: 800,
  height: 600,
  backgroundColor: "#10141c"
});`
      },
      {
        title: "4. Create Scene And Camera",
        body: "Scene owns object order. Camera2D controls world position and zoom. Objects do not draw themselves.",
        code: `import { Camera2D, Scene } from "raw2d";

const scene = new Scene();
const camera = new Camera2D({ x: 0, y: 0, zoom: 1 });`
      },
      {
        title: "5. Add A Shape",
        body: "A shape stores data and material. The renderer decides how that data is drawn.",
        code: `import { BasicMaterial, Rect } from "raw2d";

const rect = new Rect({
  x: 100,
  y: 100,
  width: 120,
  height: 80,
  material: new BasicMaterial({ fillColor: "#35c2ff" })
});

scene.add(rect);
renderer.render(scene, camera);`
      },
      {
        title: "6. Add Texture And Sprite",
        body: "Use Texture for image sources and Sprite for textured objects. Atlas packing comes after this step.",
        code: `import { Sprite, Texture } from "raw2d";

const image = document.querySelector<HTMLImageElement>("#player");

if (!image) {
  throw new Error("Image not found.");
}

const texture = new Texture({ source: image, width: image.width, height: image.height });
scene.add(new Sprite({ texture, x: 260, y: 100, width: 64, height: 64 }));`
      },
      {
        title: "7. Switch To WebGL",
        body: "Keep the same scene and camera. Swap only the renderer when you need batching and texture statistics.",
        code: `import { WebGLRenderer2D, isWebGL2Available } from "raw2d";

const renderer = isWebGL2Available({ canvas: canvasElement })
  ? new WebGLRenderer2D({ canvas: canvasElement, width: 800, height: 600 })
  : new Canvas({ canvas: canvasElement, width: 800, height: 600 });

renderer.render(scene, camera);`
      },
      {
        title: "8. Next Examples",
        body: "Use the examples as the next learning path: Canvas, WebGL sprites, texture atlas, interaction, camera controls, and ShapePath.",
        code: `/examples/canvas-basic/
/examples/webgl-basic/
/examples/sprite-atlas/
/examples/interaction-basic/
/examples/camera-controls/
/examples/shape-path/`
      },
      {
        title: "9. Open Studio After Examples",
        body: "After runnable examples make sense, open Studio docs and the public Studio route. Studio shows the same scene data as an explicit editor workflow: create objects, select, edit, save, load, and export.",
        code: `/doc#studio-shell
/doc#studio-tools
/doc#studio-scene-format
/studio`
      }
    ]
  }
];

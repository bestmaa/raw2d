import type { DocTopic } from "./DocPage.type";

export const beginnerPathTopics: readonly DocTopic[] = [
  {
    id: "beginner-path",
    label: "Beginner Path",
    title: "Beginner Path",
    description: "A short install-to-render path for the first Raw2D scene.",
    sections: [
      {
        title: "Install Raw2D",
        body: "Start with the umbrella package. It exports the stable app-level API.",
        code: `npm install raw2d`
      },
      {
        title: "Add Canvas",
        body: "Raw2D renders into a real HTMLCanvasElement that your app owns.",
        code: `<canvas id="raw2d-canvas" width="800" height="600"></canvas>`
      },
      {
        title: "Create Renderer",
        body: "CanvasRenderer is the first renderer to learn because it supports the full current object set.",
        code: `const raw2dCanvas = new CanvasRenderer({
  canvas: canvasElement,
  backgroundColor: "#10141c"
});`
      },
      {
        title: "Create Scene And Camera",
        body: "Scene stores objects. Camera2D describes which part of the world should be rendered.",
        code: `const scene = new Scene();
const camera = new Camera2D({ x: 0, y: 0, zoom: 1 });`
      },
      {
        title: "Add Shape",
        body: "Objects store data only. Renderer code decides how that data is drawn.",
        code: `const rect = new Rect({
  x: 100,
  y: 100,
  width: 120,
  height: 80,
  material: new BasicMaterial({ fillColor: "#35c2ff" })
});

scene.add(rect);`
      },
      {
        title: "Render Scene",
        body: "Render after scene changes. For animation, update object data first, then render again.",
        code: `function animate(): void {
  rect.rotation += 0.01;
  raw2dCanvas.render(scene, camera);
  requestAnimationFrame(animate);
}

animate();`
      }
    ]
  }
];

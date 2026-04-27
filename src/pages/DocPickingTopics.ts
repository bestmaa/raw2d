import type { DocTopic } from "./DocPage.type";

export const pickingTopics: readonly DocTopic[] = [
  {
    id: "picking",
    label: "Picking",
    title: "Picking Objects",
    description: "Find the topmost scene object under a pointer point.",
    sections: [
      {
        title: "pickObject",
        body: "Use pickObject when you have a scene and want Raw2D to find which object is under the pointer.",
        liveDemoId: "hit-testing",
        code: `import { pickObject } from "raw2d";

const picked = pickObject({
  scene,
  x: pointerX,
  y: pointerY
});`
      },
      {
        title: "Full Click Selection",
        body: "Create objects, add them to the scene, render, then pick on pointerdown.",
        liveDemoId: "hit-testing",
        code: `const rect = new Rect({
  name: "card",
  x: 120,
  y: 100,
  width: 180,
  height: 100
});

const circle = new Circle({
  name: "badge",
  x: 210,
  y: 120,
  radius: 46
});

scene.add(rect);
scene.add(circle);
raw2dCanvas.render(scene, camera);

canvasElement.addEventListener("pointerdown", (event) => {
  const bounds = canvasElement.getBoundingClientRect();
  const pointerX = event.clientX - bounds.left;
  const pointerY = event.clientY - bounds.top;

  const picked = pickObject({ scene, x: pointerX, y: pointerY });
});`
      },
      {
        title: "Topmost First",
        body: "By default, pickObject checks later scene objects first because later objects draw above earlier objects.",
        liveDemoId: "hit-testing",
        code: `scene.add(rect);
scene.add(circle);

// Circle wins if both objects overlap.
const picked = pickObject({ scene, x: pointerX, y: pointerY });`
      },
      {
        title: "Line Tolerance",
        body: "Pass tolerance when you want thin Line or Polyline objects to be easier to select.",
        liveDemoId: "hit-testing",
        code: `const picked = pickObject({
  scene,
  x: pointerX,
  y: pointerY,
  tolerance: 8
});`
      },
      {
        title: "Filter",
        body: "Use filter to ignore locked, disabled, hidden, or non-selectable objects.",
        liveDemoId: "hit-testing",
        code: `const picked = pickObject({
  scene,
  x: pointerX,
  y: pointerY,
  filter: (object) => object.name !== "locked"
});`
      }
    ]
  }
];

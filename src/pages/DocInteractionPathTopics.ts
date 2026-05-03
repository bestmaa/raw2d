import type { DocTopic } from "./DocPage.type";

export const interactionPathTopics: readonly DocTopic[] = [
  {
    id: "interaction-path",
    label: "Interaction Path",
    title: "Interaction Path",
    description: "A practical path for picking, selection, dragging, resizing, and keyboard movement.",
    sections: [
      {
        title: "Pick An Object",
        body: "Convert the pointer into world coordinates, then ask Raw2D which visible object is on top.",
        liveDemoId: "selection",
        code: `const picked = pickObject({
  scene,
  camera,
  x: pointerX,
  y: pointerY
});`
      },
      {
        title: "Track Selection",
        body: "SelectionManager keeps editor state out of objects and renderers.",
        liveDemoId: "selection",
        code: `const selection = new SelectionManager();

if (picked) {
  selection.select(picked, { append: event.shiftKey });
}`
      },
      {
        title: "Attach One Object",
        body: "Use attach when only one object should be draggable or resizable.",
        liveDemoId: "interaction-controller",
        code: `const interaction = new InteractionController({
  canvas: canvasElement,
  scene,
  camera
});

interaction.attach(rect, { drag: true, resize: true });`
      },
      {
        title: "Attach Selection",
        body: "Use attachSelection when the current selected objects should become interactive.",
        liveDemoId: "interaction-controller",
        code: `selection.select(rectA);
selection.select(rectB, { append: true });

interaction.attachSelection({ drag: true, resize: true });`
      },
      {
        title: "Move With Keyboard",
        body: "KeyboardController mutates selected objects only. Your app decides when to render again.",
        liveDemoId: "selection",
        code: `const keyboard = new KeyboardController({
  target: window,
  selection,
  moveStep: 4,
  fastMoveStep: 20,
  onChange: () => renderer.render(scene, camera)
});`
      }
    ]
  }
];

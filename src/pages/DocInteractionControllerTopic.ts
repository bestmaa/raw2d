import type { DocTopic } from "./DocPage.type";

export const interactionControllerTopic: DocTopic = {
  id: "interaction-controller",
  label: "Interaction Controller",
  title: "Interaction Controller",
  description: "Combine picking, selection, dragging, and Rect resizing without putting editor logic inside objects or renderers.",
  sections: [
    {
      title: "Create Controller",
      body: "Pass the canvas element, scene, and camera. The controller listens to pointer events and updates object state.",
      liveDemoId: "interaction-controller",
      code: `const interaction = new InteractionController({
  canvas: canvasElement,
  scene,
  camera,
  width: 800,
  height: 600,
  onChange: () => raw2dCanvas.render(scene, camera)
});`
    },
    {
      title: "Global Scene Mode",
      body: "Use global mode when every eligible object in the scene should respond to the same interaction features.",
      liveDemoId: "interaction-controller",
      code: `interaction.enableSelection();
interaction.enableDrag();
interaction.enableResize();`
    },
    {
      title: "Single Object",
      body: "Use attach when only one object should be interactive. attach(object) enables select, drag, and supported resize by default.",
      liveDemoId: "interaction-controller",
      code: `interaction.attach(rect);

// Only rect is interactive.
// Other scene objects are ignored.`
    },
    {
      title: "Single Object Custom",
      body: "Pass options when one object should only support specific behavior.",
      liveDemoId: "interaction-controller",
      code: `interaction.attach(rect, {
  select: true,
  drag: true,
  resize: false
});`
    },
    {
      title: "Many Objects",
      body: "Use attachMany when a known list of objects should share the same interaction behavior.",
      liveDemoId: "interaction-controller",
      code: `interaction.attachMany([rect, circle, line], {
  select: true,
  drag: true
});`
    },
    {
      title: "Current Selection",
      body: "Use attachSelection when only the objects currently selected by SelectionManager should become interactive.",
      liveDemoId: "interaction-controller",
      code: `selection.select(rectA);
selection.select(rectB, { append: true });

interaction.attachSelection({
  drag: true,
  resize: true
});`
    },
    {
      title: "Detach Objects",
      body: "Detach one object or clear all attached objects to return to global feature mode.",
      liveDemoId: "interaction-controller",
      code: `interaction.detach(rect);
interaction.clearAttachments();`
    },
    {
      title: "Read State",
      body: "Use selection and mode state for editor overlays, status text, and future transform tools.",
      liveDemoId: "interaction-controller",
      code: `const selected = interaction.getSelection().getPrimary();
const mode = interaction.getMode();
const handles = interaction.getResizeHandles();`
    },
    {
      title: "Renderer Independent",
      body: "The controller does not draw. Canvas and WebGLRenderer2D render the scene, while your tool layer draws overlays.",
      liveDemoId: "interaction-controller",
      code: `// InteractionController:
pointer -> pick -> select / drag / resize

// Renderer:
scene objects -> pixels`
    }
  ]
};

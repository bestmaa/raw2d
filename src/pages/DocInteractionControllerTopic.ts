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
      title: "Enable Features",
      body: "Features are explicit so tools can choose only the behavior they need.",
      liveDemoId: "interaction-controller",
      code: `interaction.enableSelection();
interaction.enableDrag();
interaction.enableResize();`
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
      body: "The controller does not draw. CanvasRenderer or future WebGLRenderer2D can render the scene, while your tool layer draws overlays.",
      liveDemoId: "interaction-controller",
      code: `// InteractionController:
pointer -> pick -> select / drag / resize

// Renderer:
scene objects -> pixels`
    }
  ]
};

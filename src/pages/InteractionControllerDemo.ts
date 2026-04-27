import { BasicMaterial, Camera2D, Canvas, Circle, InteractionController, Line, Rect, Scene } from "raw2d";
import type {
  InteractionControllerDemoOptions,
  InteractionControllerDemoRenderOptions,
  InteractionControllerDemoVariant,
  InteractionDemoObjects
} from "./InteractionControllerDemo.type";

const demoCanvasWidth = 520;
const demoCanvasHeight = 260;

export function createInteractionControllerDemo(options: InteractionControllerDemoOptions = {}): HTMLElement {
  const variant = options.variant ?? "global";
  const section = document.createElement("article");
  section.className = "doc-section shape-demo";
  const title = document.createElement("h2");
  const body = document.createElement("p");
  const canvasElement = document.createElement("canvas");
  const code = document.createElement("code");
  const pre = document.createElement("pre");
  const raw2dCanvas = new Canvas({ canvas: canvasElement, width: demoCanvasWidth, height: demoCanvasHeight, backgroundColor: "#10141c" });
  const scene = new Scene();
  const camera = new Camera2D();
  const objects = createObjects();
  let controller: InteractionController;

  title.textContent = getDemoTitle(variant);
  body.textContent = getDemoBody(variant);
  canvasElement.className = "shape-demo-canvas";
  pre.append(code);
  scene.add(objects.rectA);
  scene.add(objects.rectB);
  scene.add(objects.circle);
  scene.add(objects.line);
  controller = new InteractionController({
    canvas: canvasElement,
    scene,
    camera,
    width: demoCanvasWidth,
    height: demoCanvasHeight,
    minResizeWidth: 30,
    minResizeHeight: 30,
    onChange: () => renderDemo({ raw2dCanvas, scene, camera, controller, code, objects, variant })
  });
  configureController(controller, objects, variant);

  section.append(title, body, canvasElement, pre);
  renderDemo({ raw2dCanvas, scene, camera, controller, code, objects, variant });
  return section;
}

function createObjects(): InteractionDemoObjects {
  return {
    rectA: new Rect({
      name: "rectA",
      x: 70,
      y: 74,
      width: 128,
      height: 86,
      material: new BasicMaterial({ fillColor: "rgba(245, 91, 105, 0.74)" })
    }),
    rectB: new Rect({
      name: "rectB",
      x: 224,
      y: 74,
      width: 118,
      height: 86,
      material: new BasicMaterial({ fillColor: "rgba(125, 211, 252, 0.66)" })
    }),
    circle: new Circle({
      name: "circle",
      x: 405,
      y: 116,
      radius: 44,
      material: new BasicMaterial({ fillColor: "rgba(53, 194, 255, 0.54)" })
    }),
    line: new Line({
      name: "line",
      x: 84,
      y: 204,
      endX: 340,
      endY: 0,
      material: new BasicMaterial({ strokeColor: "#facc15", lineWidth: 6 })
    })
  };
}

function configureController(controller: InteractionController, objects: InteractionDemoObjects, variant: InteractionControllerDemoVariant): void {
  if (variant === "create" || variant === "renderer") {
    return;
  }

  if (variant === "global") {
    controller.enableSelection();
    controller.enableDrag();
    controller.enableResize();
    controller.getSelection().select(objects.rectA);
    return;
  }

  if (variant === "single" || variant === "state") {
    controller.attach(objects.rectA);
    controller.getSelection().select(objects.rectA);
    return;
  }

  if (variant === "single-custom") {
    controller.attach(objects.rectA, { select: true, drag: true, resize: false });
    controller.getSelection().select(objects.rectA);
    return;
  }

  if (variant === "many") {
    controller.attachMany([objects.rectA, objects.circle, objects.line], { select: true, drag: true });
    controller.getSelection().select(objects.rectA);
    controller.getSelection().select(objects.circle, { append: true });
    controller.getSelection().select(objects.line, { append: true });
    return;
  }

  if (variant === "selection") {
    controller.getSelection().select(objects.rectA);
    controller.getSelection().select(objects.rectB, { append: true });
    controller.attachSelection({ drag: true, resize: true });
    return;
  }

  controller.attach(objects.rectA);
  controller.detach(objects.rectA);
}

function renderDemo(options: InteractionControllerDemoRenderOptions): void {
  options.raw2dCanvas.render(options.scene, options.camera);
  drawOverlay(options.raw2dCanvas.getContext(), options);
  options.code.textContent = createCode(options);
}

function drawOverlay(context: CanvasRenderingContext2D, options: InteractionControllerDemoRenderOptions): void {
  const selected = options.controller.getSelection().getSelected();
  const primary = options.controller.getSelection().getPrimary();
  const handles = options.controller.getResizeHandles();

  context.save();
  context.fillStyle = "#f5f7fb";
  context.font = "14px monospace";
  context.fillText(getOverlayText(options.variant, primary?.name ?? "none"), 16, 24);
  context.strokeStyle = "#facc15";
  context.lineWidth = 2;

  for (const object of selected) {
    if (object instanceof Rect) {
      context.strokeRect(object.x, object.y, object.width, object.height);
    } else if (object instanceof Circle) {
      context.beginPath();
      context.arc(object.x, object.y, object.radius + 4, 0, Math.PI * 2);
      context.stroke();
    } else if (object instanceof Line) {
      context.strokeRect(object.x - 6, object.y - 6, object.endX + 12, 12);
    }
  }

  if (handles.length > 0) {
    context.fillStyle = "#10141c";

    for (const handle of handles) {
      context.fillRect(handle.x, handle.y, handle.width, handle.height);
      context.strokeRect(handle.x, handle.y, handle.width, handle.height);
    }
  }

  context.restore();
}

function createCode(options: InteractionControllerDemoRenderOptions): string {
  return `const interaction = new InteractionController({
  canvas: canvasElement,
  scene,
  camera,
  onChange: () => raw2dCanvas.render(scene, camera)
});

${getVariantCode(options.variant)}

// selected: ${options.controller.getSelection().getSelected().map((object) => object.name || object.id).join(", ") || "none"}
// attached: ${options.controller.getAttachedObjects().map((object) => object.name || object.id).join(", ") || "none"}`;
}

function getDemoTitle(variant: InteractionControllerDemoVariant): string {
  const titles: Record<InteractionControllerDemoVariant, string> = {
    create: "Live Controller Setup",
    global: "Live Global Interaction",
    single: "Live Single Object",
    "single-custom": "Live Custom Object",
    many: "Live Many Objects",
    selection: "Live Current Selection",
    detach: "Live Detached Object",
    state: "Live Interaction State",
    renderer: "Live Renderer Separation"
  };
  return titles[variant];
}

function getDemoBody(variant: InteractionControllerDemoVariant): string {
  const bodies: Record<InteractionControllerDemoVariant, string> = {
    create: "The controller exists but no feature is enabled yet.",
    global: "Every eligible scene object can be selected, dragged, and Rect objects can resize.",
    single: "Only rectA is interactive. Other scene objects are visible but ignored.",
    "single-custom": "rectA can select and drag, but resize handles are disabled.",
    many: "rectA, circle, and line are attached. rectB is visible but ignored.",
    selection: "rectA and rectB are selected first, then only that selection is attached.",
    detach: "rectA was attached and then detached, so no object is interactive.",
    state: "The controller state exposes selected object, mode, and handles.",
    renderer: "The scene still renders normally; interaction only mutates object data."
  };
  return bodies[variant];
}

function getOverlayText(variant: InteractionControllerDemoVariant, primaryName: string): string {
  const labels: Record<InteractionControllerDemoVariant, string> = {
    create: "controller ready | features: none",
    global: `scope: scene | selected: ${primaryName}`,
    single: `scope: rectA only | selected: ${primaryName}`,
    "single-custom": `scope: rectA | resize: off`,
    many: "scope: rectA + circle + line",
    selection: "scope: selected rectA + rectB",
    detach: "scope: none after detach",
    state: `mode: idle | selected: ${primaryName}`,
    renderer: "renderer draws scene | controller draws nothing"
  };
  return labels[variant];
}

function getVariantCode(variant: InteractionControllerDemoVariant): string {
  const code: Record<InteractionControllerDemoVariant, string> = {
    create: "// no features enabled yet",
    global: "interaction.enableSelection();\ninteraction.enableDrag();\ninteraction.enableResize();",
    single: "interaction.attach(rectA);",
    "single-custom": "interaction.attach(rectA, {\n  select: true,\n  drag: true,\n  resize: false\n});",
    many: "interaction.attachMany([rectA, circle, line], {\n  select: true,\n  drag: true\n});",
    selection: "selection.select(rectA);\nselection.select(rectB, { append: true });\n\ninteraction.attachSelection({\n  drag: true,\n  resize: true\n});",
    detach: "interaction.attach(rectA);\ninteraction.detach(rectA);",
    state: "const selected = interaction.getSelection().getPrimary();\nconst mode = interaction.getMode();\nconst handles = interaction.getResizeHandles();",
    renderer: "// InteractionController: pointer -> select / drag / resize\n// Renderer: scene objects -> pixels"
  };
  return code[variant];
}

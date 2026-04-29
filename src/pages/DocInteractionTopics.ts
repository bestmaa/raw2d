import type { DocTopic } from "./DocPage.type";
import { cameraControlsTopic } from "./DocCameraControlsTopic";
import { interactionControllerTopic } from "./DocInteractionControllerTopic";
import { keyboardTopic } from "./DocKeyboardTopic";

export const interactionTopics: readonly DocTopic[] = [
  interactionControllerTopic,
  cameraControlsTopic,
  keyboardTopic,
  {
    id: "selection",
    label: "Selection",
    title: "Selection",
    description: "Track selected objects separately from scene data and renderer drawing.",
    sections: [
      {
        title: "SelectionManager",
        body: "Use SelectionManager for editor-style selected object state.",
        liveDemoId: "selection",
        code: `import { SelectionManager } from "raw2d";

const selection = new SelectionManager();

selection.select(rect);
selection.clear();`
      },
      {
        title: "Pick And Select",
        body: "Use pickObject to find an object, then pass it into the selection manager.",
        liveDemoId: "selection",
        code: `const picked = pickObject({
  scene,
  x: pointerX,
  y: pointerY
});

if (picked) {
  selection.select(picked);
}`
      },
      {
        title: "Multi Select",
        body: "Use append or toggle for shift-click style behavior.",
        liveDemoId: "selection",
        code: `selection.select(picked, {
  append: event.shiftKey,
  toggle: event.shiftKey
});`
      },
      {
        title: "Selection Bounds",
        body: "Use getSelectionBounds to draw an outline around selected core shape objects in your tool layer.",
        liveDemoId: "selection",
        code: `const bounds = getSelectionBounds({
  objects: [rect, circle]
});

if (bounds) {
  context.strokeRect(bounds.x, bounds.y, bounds.width, bounds.height);
}`
      }
    ]
  },
  {
    id: "resize-handles",
    label: "Resize Handles",
    title: "Resize Handles",
    description: "Create and pick editor handles around selected bounds.",
    sections: [
      {
        title: "Create Handles",
        body: "Use getResizeHandles with selection bounds to create eight small handle rectangles.",
        liveDemoId: "selection",
        code: `const bounds = getSelectionBounds({
  objects: [rect, circle]
});

const handles = bounds
  ? getResizeHandles({ bounds, size: 8 })
  : [];`
      },
      {
        title: "Handle Names",
        body: "Raw2D returns corners and edges in clockwise order.",
        liveDemoId: "selection",
        code: `top-left
top
top-right
right
bottom-right
bottom
bottom-left
left`
      },
      {
        title: "Pick Handle",
        body: "Use pickResizeHandle to detect which handle the pointer is over.",
        liveDemoId: "selection",
        code: `const handle = pickResizeHandle({
  handles,
  x: pointerX,
  y: pointerY
});

if (handle) {
  canvasElement.style.cursor = handle.cursor;
}`
      },
      {
        title: "Foundation Only",
        body: "Handle geometry is separate from actual object resizing. Use the resize helpers when you want to mutate a Rect.",
        liveDemoId: "selection",
        code: `const resizeState = startObjectResize({
  object: rect,
  handleName: handle.name,
  pointerX,
  pointerY
});`
      }
    ]
  },
  {
    id: "object-resize",
    label: "Object Resize",
    title: "Object Resize",
    description: "Resize a Rect by dragging a picked resize handle.",
    sections: [
      {
        title: "Rect MVP",
        body: "Object resize currently supports simple axis-aligned Rect resizing.",
        liveDemoId: "resize",
        code: `const resizeState = startObjectResize({
  object: rect,
  handleName: "bottom-right",
  pointerX,
  pointerY,
  minWidth: 30,
  minHeight: 30
});`
      },
      {
        title: "Update Resize",
        body: "Update the resize state on pointer move, then render again.",
        liveDemoId: "resize",
        code: `updateObjectResize({
  state: resizeState,
  pointerX,
  pointerY
});

raw2dCanvas.render(scene, camera);`
      },
      {
        title: "End Resize",
        body: "End the resize state on pointer up or cancel.",
        liveDemoId: "resize",
        code: `endObjectResize({ state: resizeState });
resizeState = null;`
      },
      {
        title: "Current Scope",
        body: "Circle, Ellipse, Sprite, rotated objects, and origin-aware resize strategies should be added as focused modules later.",
        liveDemoId: "resize",
        code: `// current:
Rect + axis-aligned handles

// future:
Circle / Ellipse / Sprite strategies`
      }
    ]
  },
  {
    id: "dragging",
    label: "Dragging",
    title: "Dragging Objects",
    description: "Use optional interaction helpers to drag picked objects without mixing logic into renderers or objects.",
    sections: [
      {
        title: "Interaction Package",
        body: "Drag helpers live in raw2d-interaction and are re-exported by raw2d.",
        liveDemoId: "dragging",
        code: `npm install raw2d

import {
  startObjectDrag,
  updateObjectDrag,
  endObjectDrag
} from "raw2d";`
      },
      {
        title: "Start Drag",
        body: "Pick an object from the scene, then create a drag state from that object and the pointer position.",
        liveDemoId: "dragging",
        code: `const picked = pickObject({
  scene,
  x: pointer.x,
  y: pointer.y
});

if (picked) {
  dragState = startObjectDrag({
    object: picked,
    pointerX: pointer.x,
    pointerY: pointer.y
  });
}`
      },
      {
        title: "Update Drag",
        body: "On pointer move, update the drag state and render again.",
        liveDemoId: "dragging",
        code: `updateObjectDrag({
  state: dragState,
  pointerX: pointer.x,
  pointerY: pointer.y
});

raw2dCanvas.render(scene, camera);`
      },
      {
        title: "End Drag",
        body: "On pointer up or cancel, end the drag state.",
        liveDemoId: "dragging",
        code: `endObjectDrag({ state: dragState });
dragState = null;`
      },
      {
        title: "Plugin Style",
        body: "Dragging is separate from core and renderers so future selection, resize, rotate, and editor tools can stay modular.",
        liveDemoId: "dragging",
        code: `raw2d-core         // object data, scene, picking
raw2d-canvas       // drawing
raw2d-webgl        // batch-first WebGL drawing
raw2d-interaction  // optional pointer workflows`
      }
    ]
  }
];

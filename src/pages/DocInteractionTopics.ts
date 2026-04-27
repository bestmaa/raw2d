import type { DocTopic } from "./DocPage.type";

export const interactionTopics: readonly DocTopic[] = [
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
raw2d-webgl        // future WebGL drawing
raw2d-interaction  // optional pointer workflows`
      }
    ]
  }
];

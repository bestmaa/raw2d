import type { DocTopic } from "./DocPage.type";

export const interactionQATopics: readonly DocTopic[] = [
  {
    id: "interaction-docs-qa",
    label: "Interaction Docs QA",
    title: "Interaction Docs Visual QA",
    description: "Use this checklist before interaction docs or examples are accepted.",
    sections: [
      {
        title: "Open The Routes",
        body: "Check the interaction docs and standalone interaction example in a browser. The examples must show visible selectable objects.",
        code: `http://localhost:5197/doc#interaction-controller
http://localhost:5197/doc#selection-manager
http://localhost:5197/doc#keyboard-controller
http://localhost:5197/doc#camera-controls
http://localhost:5197/examples/interaction-basic/`
      },
      {
        title: "Pointer Behavior",
        body: "Click an object, drag it, resize a Rect from handles, then click empty space. Selection state and canvas redraw should stay in sync.",
        code: `click object -> selected
drag selected object -> x/y changes
drag Rect handle -> width/height changes
click empty canvas -> selection clears`
      },
      {
        title: "Keyboard Behavior",
        body: "With an object selected, arrow keys should move it, Shift should use the fast step, Escape should clear selection, and Delete should remove it.",
        code: `ArrowLeft / ArrowRight / ArrowUp / ArrowDown
Shift + Arrow
Escape
Delete`
      },
      {
        title: "Camera Behavior",
        body: "Pan and zoom the camera after selecting objects. Hit testing should still match pointer position after camera transforms.",
        code: `camera zoom -> object still selectable
camera pan -> drag still follows pointer
resize -> handles remain aligned`
      }
    ]
  }
];

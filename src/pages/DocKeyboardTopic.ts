import type { DocTopic } from "./DocPage.type";

export const keyboardTopic: DocTopic = {
  id: "keyboard",
  label: "Keyboard",
  title: "Keyboard Controller",
  description: "Move, delete, or clear selected objects with keyboard input.",
  sections: [
    {
      title: "Create KeyboardController",
      body: "Pass a keyboard target and SelectionManager. Use onChange to render after data changes.",
      liveDemoId: "keyboard",
      code: `const keyboard = new KeyboardController({
  target: window,
  selection,
  scene,
  onChange: () => raw2dCanvas.render(scene, camera)
});`
    },
    {
      title: "Enable Movement",
      body: "Arrow keys move all selected objects. Shift+Arrow uses fastMoveStep.",
      liveDemoId: "keyboard",
      code: `keyboard.enableMove();

// ArrowRight: x += moveStep
// Shift+ArrowRight: x += fastMoveStep`
    },
    {
      title: "Enable Delete",
      body: "Delete or Backspace removes selected objects from the scene and clears selection.",
      liveDemoId: "keyboard",
      code: `keyboard.enableDelete();

// Delete
// Backspace`
    },
    {
      title: "Enable Clear",
      body: "Escape clears the current selection without removing objects from the scene.",
      liveDemoId: "keyboard",
      code: `keyboard.enableClear();

// Escape`
    },
    {
      title: "Dispose",
      body: "Dispose removes the keydown listener when your editor or tool is destroyed.",
      liveDemoId: "keyboard",
      code: `keyboard.dispose();`
    }
  ]
};

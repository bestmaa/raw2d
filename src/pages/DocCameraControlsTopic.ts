import type { DocTopic } from "./DocPage.type";

export const cameraControlsTopic: DocTopic = {
  id: "camera-controls",
  label: "Camera Controls",
  title: "Camera Controls",
  description: "Use wheel zoom and pointer pan to move a Camera2D without coupling input logic to rendering.",
  sections: [
    {
      title: "Create CameraControls",
      body: "Pass the canvas element and camera. Use onChange to render after the camera changes.",
      liveDemoId: "camera-controls",
      code: `const controls = new CameraControls({
  target: canvasElement,
  camera,
  minZoom: 0.25,
  maxZoom: 4,
  onChange: () => raw2dCanvas.render(scene, camera)
});`
    },
    {
      title: "Enable Zoom",
      body: "Wheel zoom keeps the world point under the cursor stable.",
      liveDemoId: "camera-controls",
      code: `controls.enableZoom();

// wheel up: zoom in
// wheel down: zoom out`
    },
    {
      title: "Enable Pan",
      body: "Middle-button drag pans by default. Pass a button number to choose another pointer button.",
      liveDemoId: "camera-controls",
      code: `controls.enablePan();

// primary button pan
controls.enablePan(0);

// right button pan
controls.enablePan(2);`
    },
    {
      title: "Read Camera",
      body: "CameraControls mutates Camera2D data. The renderer reads the same camera on the next render.",
      liveDemoId: "camera-controls",
      code: `const snapshot = controls.getSnapshot();

console.log(snapshot.camera.x);
console.log(snapshot.camera.y);
console.log(snapshot.camera.zoom);`
    },
    {
      title: "Dispose",
      body: "Dispose removes wheel and pointer listeners when your editor is destroyed.",
      liveDemoId: "camera-controls",
      code: `controls.dispose();`
    }
  ]
};

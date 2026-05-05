import type { DocTopic } from "./DocPage.type";

export const studioDemoTopics: readonly DocTopic[] = [
  {
    id: "studio-demo-checklist",
    label: "Studio Demo Checklist",
    title: "Raw2D Studio Demo Checklist",
    description: "A public-demo checklist for Studio create, edit, save, load, export, and responsive checks.",
    sections: [
      {
        title: "Demo Route",
        body: "Start the Studio app, open the printed /studio/ URL, and confirm the main editor surfaces are visible.",
        code: `npm --prefix apps/studio run dev
open /studio/`
      },
      {
        title: "Create And Edit",
        body: "Use the Sample action, add each MVP object type, select from canvas and Layers, drag, resize Rect or Sprite, and edit Properties fields.",
        code: `Sample
Rect, Circle, Line, Text2D, Sprite
Layers select
Properties edit`
      },
      {
        title: "Persistence",
        body: "Save scene JSON, load it back, verify invalid JSON shows an import error, and export a PNG from the active canvas.",
        code: `Save .raw2d.json
Load .raw2d.json
Invalid JSON -> Import error
Export PNG`
      },
      {
        title: "Responsive Pass",
        body: "At phone width, the Studio layout should stack, topbar actions should wrap, panels should scroll, and the canvas should stay inside the viewport.",
        code: `npm run test:browser
npm --prefix apps/studio run build`
      }
    ]
  }
];

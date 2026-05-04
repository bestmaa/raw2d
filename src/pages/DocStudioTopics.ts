import type { DocTopic } from "./DocPage.type";

export const studioTopics: readonly DocTopic[] = [
  {
    id: "studio-scope",
    label: "Studio Scope",
    title: "Raw2D Studio Scope",
    description: "A focused visual editor plan that stays separate from the core rendering library.",
    sections: [
      {
        title: "Goal",
        body: "Raw2D Studio will be a visual editor for creating, inspecting, and exporting Raw2D scenes. It should prove the engine is practical without making the library heavy."
      },
      {
        title: "MVP",
        body: "The first version should include a canvas workspace, add-object tools, selection, drag, resize, properties, layers, assets, save/load scene JSON, PNG export, and Canvas/WebGL renderer switching.",
        code: `Studio MVP:
- add Rect, Circle, Line, Text2D, Sprite
- select, drag, resize, rotate
- edit transforms and material values
- save/load scene JSON
- export PNG`
      },
      {
        title: "Non-Goals",
        body: "Studio is not a full Photoshop clone. Advanced photo editing, brush engines, physics, timelines, plugin marketplace, and hidden renderer automation are outside the first phase.",
        code: `Not in MVP:
- photo editing pipeline
- brush engine
- physics editor
- timeline animation editor
- plugin marketplace`
      },
      {
        title: "Boundary",
        body: "Studio should be an app or later package that composes Raw2D modules. Core, Canvas, WebGL, interaction, sprite, and text packages must remain independent.",
        code: `raw2d-core
raw2d-canvas
raw2d-webgl
raw2d-interaction
raw2d-studio  # later app/package`
      }
    ]
  }
];

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
  },
  {
    id: "studio-boundary",
    label: "Studio Boundary",
    title: "Raw2D Studio Boundary",
    description: "Where Studio should live, what it may import, and what must stay out of runtime packages.",
    sections: [
      {
        title: "Location",
        body: "Studio should start as apps/studio in this repository. It should stay outside package runtime code so editor UI cannot leak into core rendering modules.",
        code: `apps/studio`
      },
      {
        title: "Dependency Direction",
        body: "Studio may import Raw2D packages, but Raw2D packages must never import Studio. This keeps the engine installable without editor code.",
        code: `apps/studio -> raw2d-core
apps/studio -> raw2d-canvas
apps/studio -> raw2d-webgl
apps/studio -> raw2d-interaction`
      },
      {
        title: "Later Package",
        body: "After the editor API is stable, Studio can become raw2d-studio. It should not be re-exported from the umbrella raw2d package.",
        code: `npm install raw2d-studio
# separate from npm install raw2d`
      },
      {
        title: "Shared Code Rule",
        body: "Reusable engine logic can move to focused Raw2D packages only when it is useful without the editor. Panel state and toolbar commands belong in Studio.",
        code: `Engine logic: packages/*
Editor UI state: apps/studio`
      }
    ]
  },
  {
    id: "studio-scene-format",
    label: "Studio Scene JSON",
    title: "Studio Scene JSON Format",
    description: "A versioned save/load shape for future Raw2D Studio scenes.",
    sections: [
      {
        title: "Document",
        body: "Studio should save a readable JSON document with version, metadata, camera, scene objects, and assets. It should not store renderer internals.",
        code: `{
  "version": 1,
  "meta": { "name": "Untitled Scene", "createdWith": "raw2d-studio" },
  "camera": { "x": 0, "y": 0, "zoom": 1 },
  "scene": { "objects": [] },
  "assets": { "textures": [] }
}`
      },
      {
        title: "Object",
        body: "Objects should use explicit type values and public Raw2D-style fields, so saved scenes stay easy to inspect and edit.",
        code: `{
  "id": "rect-1",
  "type": "rect",
  "x": 100,
  "y": 80,
  "width": 140,
  "height": 90,
  "origin": "center",
  "material": { "fillColor": "#35c2ff" }
}`
      },
      {
        title: "Assets",
        body: "Texture assets should be referenced by stable IDs. Sprite objects should point to textureId and optional frameName instead of storing image bytes.",
        code: `{
  "id": "hero-texture",
  "src": "./assets/hero.png",
  "width": 256,
  "height": 256
}`
      },
      {
        title: "Load",
        body: "Load should validate the JSON before creating Raw2D objects. Error messages should point to fields such as scene.objects[2].width.",
        code: `validate -> create assets -> create objects -> render`
      }
    ]
  }
];

import type { DocTopic } from "./DocPage.type";
import { studioInteractionTopics } from "./DocStudioInteractionTopics";

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
    description: "The current versioned save/load shape for Raw2D Studio scenes.",
    sections: [
      {
        title: "Current Document",
        body: "Studio saves a readable JSON document with version, name, rendererMode, camera, and objects. It does not store renderer internals.",
        code: `{
  "version": 1,
  "name": "Untitled Scene",
  "rendererMode": "canvas",
  "camera": { "x": 0, "y": 0, "zoom": 1 },
  "objects": []
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
        title: "Save Load Export",
        body: "Save downloads .raw2d.json, Load validates and replaces Studio scene state, and Export downloads the current canvas preview as PNG.",
        code: `serializeStudioScene(scene)
deserializeStudioScene(json)
getStudioCanvasPngDataUrl(root)`
      },
      {
        title: "Import Errors",
        body: "Invalid JSON is reported in the Studio status bar before any scene state is replaced.",
        code: `Import error: Studio scene version must be 1.`
      }
    ]
  },
  {
    id: "studio-tools",
    label: "Studio Tools",
    title: "Raw2D Studio Tools",
    description: "Focused editor modes for selecting, moving, resizing, adding text, drawing shapes, and placing sprites.",
    sections: [
      {
        title: "Model",
        body: "A Studio tool should convert pointer or keyboard input into explicit editor commands. Tools should mutate scene state, then request a render.",
        code: `pointer event -> tool -> command -> scene state -> render`
      },
      {
        title: "Select And Move",
        body: "Select should use picking, support multi-select later, and reuse raw2d-interaction for drag and resize where possible. Move updates x and y.",
        code: `select object
drag selected -> update x/y
resize handle -> update bounds fields`
      },
      {
        title: "Current Create Tools",
        body: "The MVP toolbar creates Rect, Circle, Line, Text2D, and Sprite placeholder objects. Each click appends scene JSON, redraws, and updates Layers and Properties.",
        code: `addStudioRectObject({ scene })
addStudioCircleObject({ scene })
addStudioLineObject({ scene })
addStudioTextObject({ scene })
addStudioSpriteObject({ scene })`
      },
      {
        title: "Sprite Placeholder",
        body: "Sprite currently stores an asset slot and renders as a placeholder. Later save/load can point that slot to a texture or atlas frame.",
        code: `{
  "type": "sprite",
  "width": 128,
  "height": 128,
  "assetSlot": "empty"
}`
      }
    ]
  },
  {
    id: "studio-panels",
    label: "Studio Panels",
    title: "Raw2D Studio Panels",
    description: "Layers, properties, assets, and renderer stats panels for the future Studio app.",
    sections: [
      {
        title: "Layout",
        body: "Studio uses a predictable editor layout: tools on the left, canvas workspace in the center, and renderer, stats, layers, and properties on the right.",
        code: `left: tools
center: canvas workspace
right: renderer, stats, layers, properties`
      },
      {
        title: "Layers",
        body: "Layers show object name, type, visibility, order controls, and selection. The panel can select, hide/show, move up, and move down without touching renderer internals.",
        code: `Blue Card      Rect    Hide Up Down
Accent Circle  Circle  Hide Up Down`
      },
      {
        title: "Properties",
        body: "Properties edits public selected-object fields: x, y, width, height, radius, text, font, fillColor, strokeColor, and lineWidth. Visibility remains a layer command.",
        code: `transform: x, y
geometry: width, height, radius, text, font
material: fillColor, strokeColor, lineWidth`
      },
      {
        title: "Renderer Stats",
        body: "Renderer stats are read-only diagnostics after every render. Canvas reports objects, draw calls, and render-list counts; WebGL also reports batches, vertices, texture binds, and unsupported objects.",
        code: `Canvas: objects, drawCalls, accepted, hidden, culled
WebGL: batches, vertices, textureBinds, unsupported`
      },
      {
        title: "Assets",
        body: "Assets are still planned. Sprite currently keeps an assetSlot placeholder until save/load and asset import arrive.",
        code: `assetSlot: "empty"`
      }
    ]
  },
  ...studioInteractionTopics
];

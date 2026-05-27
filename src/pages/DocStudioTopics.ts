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
        body: "Studio saves a readable JSON document with version, name, rendererMode, camera, assets, and objects. It does not store renderer internals.",
        code: `{
  "version": 1,
  "name": "Untitled Scene",
  "rendererMode": "canvas",
  "camera": { "x": 0, "y": 0, "zoom": 1 },
  "assets": [],
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
        body: "Save downloads .raw2d.json, Load validates and replaces Studio scene state, Export downloads the current canvas preview as PNG, Copy Code writes a Canvas-only Raw2D snippet, and Copy WebGL writes a WebGLRenderer2D snippet with explicit renderer support warnings. Unsupported object types and invalid geometry become import errors; missing asset references load with warnings.",
        code: `serializeStudioScene(scene)
deserializeStudioScene(json)
Loaded scene with warnings
import { Canvas, Scene } from "raw2d"
import { WebGLRenderer2D, isWebGL2Available } from "raw2d"
getStudioCanvasPngDataUrl(root)`
      },
      {
        title: "Assets",
        body: "Studio saves safe image asset metadata and Sprite assetSlot references. Browser blob URLs used for image preview are runtime-only and are not written into .raw2d.json.",
        code: `{
  "assets": [
    { "id": "asset-1", "type": "image", "name": "hero.png", "width": 320, "height": 180, "mimeType": "image/png", "objectIds": ["sprite-1"] }
  ],
  "objects": [
    { "id": "sprite-1", "type": "sprite", "assetSlot": "asset-1" }
  ]
}`
      },
      {
        title: "Import Errors",
        body: "Invalid JSON is reported in the Studio status bar before any scene state is replaced. Missing Sprite asset references are returned as load diagnostics.",
        code: `Import error: Studio scene version must be 1.
Sprite sprite-1 references missing asset asset-9.`
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
        body: "Select uses picking, shift-select multi selection, explicit group bounds, and handles. Move updates x and y; Rect and Sprite resize bounds, Circle resize radius, Line resize endpoints, and Text2D resize scales the px font size.",
        code: `select object
shift-select -> toggle multi selection
drag selected -> update x/y
resize handle -> update bounds or font scale`
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
        body: "Sprite stores an asset slot. Use the Assets panel to import an image, select a Sprite, select the asset, and click Use to bind it. The runtime adapter renders asset-backed Sprites as Raw2D Sprite and Texture objects.",
        code: `{
  "type": "sprite",
  "width": 128,
  "height": 128,
  "assetSlot": "asset-1"
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
        body: "Layers show object name, type, visibility, order controls, and selection. The panel can select, shift-select multiple objects, hide/show, move up, and move down without touching renderer internals.",
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
        body: "Assets can import local images, show a preview, remove entries, and bind the selected image asset to the selected Sprite. Save keeps metadata, not image bytes or blob URLs.",
        code: `Import -> select asset -> select Sprite -> Use
assetSlot: "asset-1"`
      }
    ]
  },
  ...studioInteractionTopics
];

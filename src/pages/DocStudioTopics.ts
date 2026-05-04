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
        body: "Studio should use a predictable editor layout: tools and layers on the left, canvas workspace in the center, properties/assets/stats on the right.",
        code: `left: tools and layers
center: canvas workspace
right: properties, assets, renderer stats`
      },
      {
        title: "Layers",
        body: "Layers should show object name, type, visibility, locked state, zIndex or order, and selection. It edits scene state, not renderer internals.",
        code: `Rect  visible  unlocked  zIndex: 0
Text2D visible  locked    zIndex: 1`
      },
      {
        title: "Properties And Assets",
        body: "Properties edits public object fields. Assets manages textures, atlas frames, active sprite assets, and missing asset warnings.",
        code: `transform, geometry, material, render
textures, atlas frames, sprite asset`
      },
      {
        title: "Renderer Stats",
        body: "Renderer stats should be read-only diagnostics for draw calls, texture binds, cache hits, cache misses, and unsupported object warnings.",
        code: `renderer: WebGLRenderer2D
objects: 280
drawCalls: 12
textureBinds: 2`
      }
    ]
  },
  {
    id: "studio-shell",
    label: "Studio Shell",
    title: "Studio MVP Shell",
    description: "A placeholder route for the future editor that stays separate from Raw2D runtime packages.",
    sections: [
      {
        title: "Route",
        body: "The /studio route in the docs app is a UI-only shell for planning the editor layout. The separate apps/studio Vite app is the implementation workspace.",
        code: `open /studio
npm --prefix apps/studio run dev`
      },
      {
        title: "Purpose",
        body: "The shell gives Raw2D a visible editor direction without coupling Studio to core, Canvas, WebGL, interaction, sprite, or text packages.",
        code: `Studio UI -> future editor state
Raw2D packages -> runtime engine`
      },
      {
        title: "App Boundary",
        body: "Studio app code lives under apps/studio. Runtime packages must not import it, and built files go to dist-studio.",
        code: `apps/studio
dist-studio  # ignored build output`
      },
      {
        title: "Verification",
        body: "The first shell is verified with strict TypeScript, Vite production build, and browser checks for the topbar, tools, layers, properties, workspace, and console errors.",
        code: `npm --prefix apps/studio run typecheck
npm --prefix apps/studio run build`
      }
    ]
  }
];

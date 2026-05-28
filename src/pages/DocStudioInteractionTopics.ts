import type { DocTopic } from "./DocPage.type";

export const studioInteractionTopics: readonly DocTopic[] = [
  {
    id: "studio-interaction",
    label: "Studio Interaction",
    title: "Raw2D Studio Interaction",
    description: "Selection, drag, resize, advanced editing, keyboard accessibility, undo, redo, and stats behavior in the current Studio app.",
    sections: [
      {
        title: "Current Controls",
        body: "Studio supports selection, shift-select multi-selection, drag movement, Rect/Sprite resize handles, keyboard nudging, delete, escape clear, copy, and paste. Input becomes explicit scene-state updates.",
        code: `click object -> select
shift-click -> toggle multi-selection
drag selected -> update x/y
corner handle -> resize Rect/Sprite
Arrow keys -> nudge
Escape -> clear selection
Delete -> remove selected
Ctrl/Cmd+C -> copy selection
Ctrl/Cmd+V -> paste selection`
      },
      {
        title: "State Flow",
        body: "Interaction code updates StudioSceneState first, then the runtime adapter creates Raw2D objects for Canvas or WebGL rendering. The canvas preview is not the source of truth.",
        code: `input -> Studio command -> StudioSceneState -> runtime adapter -> renderer`
      },
      {
        title: "Undo Redo",
        body: "Create, delete, drag, resize, keyboard movement, layer visibility, layer order, grouping, arrangement, paste, and transform, material, or text property edits are recorded in Studio history.",
        code: `Ctrl/Cmd+Z -> undoStudioHistory
Ctrl/Cmd+Shift+Z -> redoStudioHistory
Ctrl+Y -> redoStudioHistory`
      },
      {
        title: "Advanced Editing",
        body: "Group and Ungroup preserve visible hierarchy and child world positions. Duplicate remaps ids and Sprite asset references. Align, distribute, and snap use selection bounds and transform batch commands.",
        code: `Group -> replace-objects
Ungroup -> replace-objects
Duplicate -> replace-objects
Align Left -> update-transform batch
Distribute H -> update-transform batch
Snap -> update-transform batch`
      },
      {
        title: "Navigation And Clipboard",
        body: "Zoom Selection and Fit Scene update camera state without rewriting objects. The minimap displays object bounds and viewport bounds. Copy and Paste use a versioned raw2d-studio-clipboard JSON payload with validation and id remapping.",
        code: `zoomStudioCameraToSelection
fitStudioCameraToScene
createStudioMinimapModel
raw2d-studio-clipboard`
      },
      {
        title: "Keyboard",
        body: "Arrow keys move by one unit, Shift+Arrow moves by ten units, Escape clears selection, Delete or Backspace removes the selected object, and Ctrl/Cmd+C or Ctrl/Cmd+V copy and paste valid Studio selections.",
        code: `ArrowRight -> x + 1
Shift+ArrowRight -> x + 10
Escape -> selectedObjectId = undefined
Ctrl/Cmd+C -> copy selection
Ctrl/Cmd+V -> paste selection`
      },
      {
        title: "Keyboard Accessibility",
        body: "Toolbar actions stay as buttons so Tab, Shift+Tab, and Enter can reach and activate them. Property inputs keep text editing safe, and editor shortcuts should not steal normal typing from focused fields.",
        code: `Tab -> next toolbar or panel control
Shift+Tab -> previous control
Enter -> activate focused button
focused input -> keep typing local`
      },
      {
        title: "Panel Commands",
        body: "Layers and Properties mutate editor state through focused helpers. Stats reads renderer diagnostics after rendering and remains read-only.",
        code: `applyStudioLayerAction
applyStudioPropertyEdit
createStudioStatsPanel`
      },
      {
        title: "Command History",
        body: "Studio command history stores reversible commands and stays separate from Canvas and WebGL renderers.",
        code: `applyStudioHistoryCommand
undoStudioHistory
redoStudioHistory`
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

import type { DocTopic } from "./DocPage.type";

export const studioInteractionTopics: readonly DocTopic[] = [
  {
    id: "studio-interaction",
    label: "Studio Interaction",
    title: "Raw2D Studio Interaction",
    description: "Selection, drag, resize, keyboard, layer, property, undo, redo, and stats behavior in the current Studio app.",
    sections: [
      {
        title: "Current Controls",
        body: "Studio supports single-object selection, drag movement, Rect/Sprite resize handles, keyboard nudging, delete, and escape clear. Input becomes explicit scene-state updates.",
        code: `click object -> select
drag selected -> update x/y
corner handle -> resize Rect/Sprite
Arrow keys -> nudge
Escape -> clear selection
Delete -> remove selected`
      },
      {
        title: "State Flow",
        body: "Interaction code updates StudioSceneState first, then the runtime adapter creates Raw2D objects for Canvas or WebGL rendering. The canvas preview is not the source of truth.",
        code: `input -> Studio command -> StudioSceneState -> runtime adapter -> renderer`
      },
      {
        title: "Undo Redo",
        body: "Create, delete, drag, resize, keyboard movement, layer visibility, layer order, and transform, material, or text property edits are recorded in Studio history.",
        code: `Ctrl/Cmd+Z -> undoStudioHistory
Ctrl/Cmd+Shift+Z -> redoStudioHistory
Ctrl+Y -> redoStudioHistory`
      },
      {
        title: "Keyboard",
        body: "Arrow keys move by one unit, Shift+Arrow moves by ten units, Escape clears selection, and Delete or Backspace removes the selected object.",
        code: `ArrowRight -> x + 1
Shift+ArrowRight -> x + 10
Escape -> selectedObjectId = undefined`
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

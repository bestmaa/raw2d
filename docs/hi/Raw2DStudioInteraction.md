# Raw2D Studio Interaction

Studio interaction ko simple aur explicit rakha gaya hai: browser input ek chhota editor command banta hai, command scene state update karta hai, aur renderer us state se redraw karta hai.

## Abhi Ke Controls

Abhi Studio app ek ya zyada selected objects ke liye direct editing support karta hai:

- object par click karke select karein
- shift click objects ya Layers rows se multi-selection banayein
- selected object ko drag karke `x` aur `y` move karein
- Rect ya Sprite ke corner handles drag karke resize karein
- Arrow keys se selected object nudge karein
- Shift ke saath Arrow keys larger movement ke liye use karein
- Escape se selection clear karein
- Delete ya Backspace se selected object remove karein
- Ctrl/Cmd+Z se undo karein
- Ctrl/Cmd+Shift+Z ya Ctrl+Y se redo karein
- Ctrl/Cmd+C se current selection copy karein
- Ctrl/Cmd+V se valid Studio clipboard payload paste karein

## Scene State Flow

Selection, drag, resize, keyboard, layer, aur property changes Raw2D runtime objects ko direct mutate nahi karte. Ye Studio scene object array ka naya version banate hain.

```text
input -> Studio command -> StudioSceneState -> runtime adapter -> renderer
```

Isse editor ko debug karna asaan rehta hai. Canvas state ka preview hai, source of truth nahi.

## Selection Aur Resize

Selection Studio scene state ke world-space hit testing se hota hai. Resize handles Studio overlay path draw karta hai, aur abhi sirf Rect aur Sprite ke liye handles aate hain.

```text
Rect/Sprite selected -> four corner handles
Circle/Line/Text2D selected -> resize handles abhi nahi
```

## Advanced Editing Workflows

Group aur Ungroup scene graph ko visible rakhte hain. Group children store karta hai, Layers panel hierarchy expose kar sakta hai, aur ungroup child world positions restore karta hai taaki scene jump na ho.

```text
do objects select -> Group -> selectedObjectIds = [group-id]
group select -> Ungroup -> selectedObjectIds = child ids
```

Duplicate, align, distribute, aur snap normalized selection par kaam karte hain. Duplicate clone ko offset karta hai, ids remap karta hai, aur Sprite asset references carry karta hai. Align aur distribute selection bounds use karte hain. Snap selected world positions ko grid par round karta hai.

```text
Duplicate -> replace-objects
Align Left -> update-transform batch
Distribute H -> update-transform batch
Snap -> update-transform batch
```

Zoom Selection, Fit Scene, aur minimap sirf camera state change ya display karte hain. Ye object geometry rewrite nahi karte.

## Clipboard Workflow

Copy selected objects aur safe asset metadata ka versioned `raw2d-studio-clipboard` JSON payload likhta hai. Paste command banane se pehle payload validate karta hai. Invalid clipboard text ignore hota hai aur scene replace nahi hota.

```text
Ctrl/Cmd+C -> selected objects serialize
Ctrl/Cmd+V -> validate, ids remap, paste, pasted objects select
```

## Keyboard Commands

Keyboard commands Studio document listener tak scoped hain aur sirf known editor keys handle karte hain. Unknown keys ignore hote hain taaki text inputs aur future shortcuts predictable rahein.

```text
ArrowRight -> x + 1
Shift+ArrowRight -> x + 10
Escape -> selectedObjectId = undefined
Delete -> selected object remove
Ctrl/Cmd+Z -> last edit undo
Ctrl/Cmd+Shift+Z -> last undone edit redo
Ctrl/Cmd+C -> selection copy
Ctrl/Cmd+V -> selection paste
```

## Keyboard Accessibility

Toolbar actions buttons hain, isliye Tab aur Shift+Tab un tak pahunch sakte hain aur Enter unhe activate kar sakta hai. Property inputs text editing safe rakhte hain: focused fields ke andar editor shortcuts normal typing steal nahi karne chahiye. Escape sirf editor workflow ke liye selection clear karta hai, aur destructive commands undoable commands ke through hi jaate hain.

## Command History

Studio scene data badalne wale edits ke liye reversible editor commands record karta hai:

- object create
- selected object delete
- drag move aur keyboard movement
- Rect aur Sprite resize
- layer visibility aur layer order
- transform, material, text, aur font property edits
- grouping, ungrouping, duplicate, arrangement, aur paste edits

Selection-only changes, renderer switch, Save, Export, aur failed imports history me add nahi hote. Scene ya sample scene load karne par history reset hoti hai, taaki purana undo stack naye document ko change na kare.

```text
applyStudioHistoryCommand -> undoStack
undoStudioHistory -> redoStack
redoStudioHistory -> undoStack
```

## Panel Commands

Layers, Properties, aur Stats drawing logic se separate hain:

- Layers scene objects select, visibility toggle, aur reorder karta hai.
- Properties transform, geometry, text, aur material fields edit karta hai.
- Stats render ke baad renderer diagnostics read karta hai.

Panels editor state update karte hain ya renderer output dikhate hain. Panels khud objects draw nahi karte.

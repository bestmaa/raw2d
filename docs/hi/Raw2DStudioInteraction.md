# Raw2D Studio Interaction

Studio interaction ko simple aur explicit rakha gaya hai: browser input ek chhota editor command banta hai, command scene state update karta hai, aur renderer us state se redraw karta hai.

## Abhi Ke Controls

Abhi Studio app ek selected object ke liye direct editing support karta hai:

- object par click karke select karein
- selected object ko drag karke `x` aur `y` move karein
- Rect ya Sprite ke corner handles drag karke resize karein
- Arrow keys se selected object nudge karein
- Shift ke saath Arrow keys larger movement ke liye use karein
- Escape se selection clear karein
- Delete ya Backspace se selected object remove karein

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

## Keyboard Commands

Keyboard commands Studio document listener tak scoped hain aur sirf known editor keys handle karte hain. Unknown keys ignore hote hain taaki text inputs aur future shortcuts predictable rahein.

```text
ArrowRight -> x + 1
Shift+ArrowRight -> x + 10
Escape -> selectedObjectId = undefined
Delete -> selected object remove
```

## Panel Commands

Layers, Properties, aur Stats drawing logic se separate hain:

- Layers scene objects select, visibility toggle, aur reorder karta hai.
- Properties transform, geometry, text, aur material fields edit karta hai.
- Stats render ke baad renderer diagnostics read karta hai.

Panels editor state update karte hain ya renderer output dikhate hain. Panels khud objects draw nahi karte.

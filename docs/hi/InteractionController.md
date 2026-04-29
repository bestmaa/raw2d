# InteractionController

InteractionController optional editor-style pointer system hai. Isse selection, drag, aur Rect resize jaisi cheezein add hoti hain.

Ye renderer nahi hai. Ye object state update karta hai, phir aap `onChange` me render call kar sakte ho.

## Basic Setup

```ts
import {
  Camera2D,
  Canvas,
  InteractionController,
  Rect,
  Scene,
  SelectionManager
} from "raw2d";

const raw2dCanvas = new Canvas({ canvas: canvasElement });
const scene = new Scene();
const camera = new Camera2D();
const selection = new SelectionManager();

const interaction = new InteractionController({
  canvas: canvasElement,
  scene,
  camera,
  selection,
  onChange: () => raw2dCanvas.render(scene, camera)
});
```

## Whole Scene Interactive

Sab eligible objects par same behavior chahiye ho to global features enable karo.

```ts
interaction.enableSelection();
interaction.enableDrag();
interaction.enableResize();
```

## Sirf Ek Object

Ek object ko interactive banana ho:

```ts
interaction.attach(rect, {
  select: true,
  drag: true,
  resize: true
});
```

## Selected Objects

Pehle selection set karo, phir us selection ko attach karo.

```ts
selection.select(rectA);
selection.select(rectB, { append: true });

interaction.attachSelection({
  drag: true,
  resize: true
});
```

## Filter

Agar sirf kuch objects pick karne hain, constructor me filter do.

```ts
const interaction = new InteractionController({
  canvas: canvasElement,
  scene,
  camera,
  filter: (object) => object.visible,
  onChange: () => raw2dCanvas.render(scene, camera)
});
```

## Important Notes

- Selection aur drag object state mutate karte hain.
- Resize abhi Rect-focused hai.
- Overlay draw karna renderer ya app ka kaam hai.
- Raw2D low-level rakhta hai, isliye aap decide karte ho render kab call karna hai.

## English Reference

Detailed English version: `docs/InteractionController.md`

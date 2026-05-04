# Raw2D Studio Tools

Studio tools chhote editor modes hone chahiye jo explicit commands ke through scene state mutate karein.

## Tool Model

Har tool ka ek clear kaam hona chahiye:

```text
pointer event -> tool -> editor command -> scene JSON/state -> render
```

Tools directly draw nahi karenge. State change ke baad renderer se redraw karaya ja sakta hai.

## Select Tool

Select picking ke through ek ya zyada objects choose karta hai.

- click top object select karta hai
- shift click selection toggle karta hai
- empty click selection clear karta hai
- drag selected objects move kar sakta hai
- handles selected object bounds resize kar sakte hain

## Move Tool

Move selected objects translate karne ka focused mode hai.

Yeh `x` aur `y` update karega, object geometry rewrite nahi karega.

## Resize Tool

Resize bounds handles use karega aur jahan possible ho opposite edge preserve karega.

Rect, Sprite, Text2D, aur image-like objects direct resize ho sakte hain. Circle radius resize karega. Line endpoints later move ho sakte hain.

## Current MVP Tools

Abhi Studio shell me simple click-to-create tools hain:

```ts
// Chhota example
clickTool("rect");
clickTool("circle");
clickTool("line");
clickTool("text");
clickTool("sprite");
```

Har click scene state me ek object add karta hai, canvas redraw hota hai, aur Layers/Properties update hote hain.

## Rect Tool

Rect tool width, height, aur material data ke saath rectangle create karta hai.

```ts
addStudioRectObject({ scene });
```

Full scene object:

```json
{
  "id": "rect-1",
  "type": "rect",
  "name": "Rect 1",
  "x": 120,
  "y": 120,
  "width": 160,
  "height": 96,
  "material": {
    "fillColor": "#35c2ff",
    "strokeColor": "#dff5ff",
    "lineWidth": 2
  }
}
```

## Circle Tool

Circle tool radius aur material data ke saath circle create karta hai.

```ts
addStudioCircleObject({ scene });
```

Properties panel `X`, `Y`, aur `Radius` dikhata hai.

## Line Tool

Line tool local start aur end points ke saath stroke create karta hai.

```ts
addStudioLineObject({ scene });
```

Transform line geometry se alag store hota hai:

```json
{ "x": 120, "y": 300, "startX": 0, "startY": 0, "endX": 240, "endY": 0 }
```

## Text Tool

Text tool Text2D create karta hai aur Properties me text/font values dikhata hai.

```ts
addStudioTextObject({ scene });
```

Default text object:

```json
{ "type": "text2d", "text": "Raw2D Text", "font": "32px sans-serif" }
```

## Sprite Tool

Sprite tool placeholder object create karta hai jisme asset slot hota hai.

```ts
addStudioSpriteObject({ scene });
```

Current placeholder:

```json
{ "type": "sprite", "width": 128, "height": 128, "assetSlot": "empty" }
```

Later asset slot texture ya atlas frame ko point kar sakta hai, tool boundary change kiye bina.

## Command Rule

Sab tools later command objects produce karenge taaki undo/redo tool logic rewrite kiye bina add ho sake.

```text
CreateObjectCommand
UpdateTransformCommand
UpdateMaterialCommand
DeleteSelectionCommand
```

## Verification

- Har tool explicit scene state changes se map hota hai.
- Tools Canvas ya WebGL rendering logic own nahi karte.
- Selection aur resize jahan possible ho `raw2d-interaction` reuse karte hain.

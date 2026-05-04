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

## Shape Tool

Shape tool Rect, Circle, Line, Polygon, aur ShapePath objects create karega.

MVP me pehle click-drag Rect aur Circle support karo. Complex paths later aa sakte hain.

## Text Tool

Text tool Text2D create karega aur properties panel open karega jahan content, font, aur material edit ho.

MVP me ise rich text editor nahi banana.

## Sprite Tool

Sprite tool selected assets se Sprite objects create karega.

Agar atlas frame selected hai, new Sprite `textureId` aur `frameName` store karega.

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

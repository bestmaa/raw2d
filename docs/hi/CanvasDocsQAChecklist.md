# Canvas Docs Visual QA Checklist

Canvas docs change accept karne se pehle ye checklist follow karo.

## Routes

- `/doc#canvas-init` open karo.
- `/doc#rect`, `/doc#circle`, `/doc#line`, `/doc#text2d`, aur `/doc#sprite` open karo.
- `/examples/canvas-basic/` open karo.
- Har route console error ke bina load hona chahiye.

## Visual Result

- Canvas blank nahi hona chahiye.
- Rect, Circle, Line, Text2D, aur Sprite ka output code ke saath match hona chahiye.
- Har render se pehle background clear hona chahiye.
- Resize ke baad purane pixels nahi bachne chahiye.

## Parameter Coverage

- Rect me x, y, width, height, origin, aur material fill explain hona chahiye.
- Circle me x, y, radius, origin, aur material fill explain hona chahiye.
- Line me x, y, start/end points, stroke color, aur line width explain hona chahiye.
- Text2D me text, font size, fill color, aur alignment basics explain hona chahiye.
- Sprite me texture loading aur source rectangle basics explain hona chahiye.

## Browser Check

Commit se pehle real browser me check karo. Visible pixels, console errors,
readable controls, aur route reload sab verify hone chahiye.

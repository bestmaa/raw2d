# Canvas Docs Visual QA Checklist

Use this checklist before a Canvas docs change is accepted.

## Routes

- Open `/doc#canvas-init`.
- Open `/doc#rect`, `/doc#circle`, `/doc#line`, `/doc#text2d`, and `/doc#sprite`.
- Open `/examples/canvas-basic/`.
- Confirm every route loads without console errors.

## Visual Result

- Canvas output must not be blank.
- Rect, Circle, Line, Text2D, and Sprite examples must match the code shown near them.
- Background clear should happen before each new render.
- Resize should not leave old pixels behind.

## Parameter Coverage

- Rect explains x, y, width, height, origin, and material fill.
- Circle explains x, y, radius, origin, and material fill.
- Line explains x, y, start/end points, stroke color, and line width.
- Text2D explains text, font size, fill color, and alignment basics.
- Sprite explains texture loading and source rectangle basics.

## Browser Check

Use a real browser before committing. The check must include visible pixels,
no console errors, readable controls, and a route reload.

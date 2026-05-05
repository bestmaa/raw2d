# Raw2D Studio Demo Checklist

Use this checklist before showing Raw2D Studio publicly.

## Demo Route

- Open `npm --prefix apps/studio run dev`.
- Open the printed `/studio/` URL.
- Confirm the topbar, tools, canvas, renderer switch, stats, layers, properties, and status bar are visible.

## Create And Edit

- Click Sample and confirm three objects appear.
- Add Rect, Circle, Line, Text2D, and Sprite.
- Select an object from the canvas and from Layers.
- Drag the selected object.
- Resize a Rect or Sprite.
- Edit transform, geometry, text, and material fields in Properties.

## Persistence

- Save a `.raw2d.json` file.
- Load the saved file and confirm object count, names, renderer mode, and camera state round-trip.
- Try invalid JSON and confirm the status bar shows an import error.
- Export PNG and confirm the downloaded file opens.

## Responsive Check

- Open the Studio app at phone width.
- Confirm the layout stacks, topbar actions wrap, panels scroll, and canvas stays inside the viewport.

## Pass Criteria

The demo is ready only when `npm run test:browser`, `npm --prefix apps/studio run build`, and the manual demo route pass.

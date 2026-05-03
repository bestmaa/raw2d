# Docs Accessibility Smoke Checklist

Use this checklist before accepting docs UI or live control changes.

## Keyboard Navigation

- Tab through `/doc`.
- Shift+Tab backward through controls.
- Enter should activate focused buttons, links, details, and toggles.
- Escape should close temporary UI when present.
- Search should remain usable without a mouse.

## Readable Controls

- Focus state is visible.
- Labels are readable.
- Text is not clipped on desktop or mobile widths.
- English/Hinglish toggle is clear.
- Left navigation can scroll.
- Right live controls remain usable.

## Canvas And WebGL Examples

Canvas output should have nearby text that explains what is visible. WebGL stats,
interaction selected state, and visual test results should be readable text, not
canvas-only information.

## Smoke Routes

Open `/doc`, `/doc#canvas-init`, `/doc#webgl-renderer`, and
`/doc#interaction-controller` in a real browser before committing.

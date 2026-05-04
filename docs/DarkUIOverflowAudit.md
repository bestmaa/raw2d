# Dark UI Overflow Audit

This audit protects the dark Raw2D documentation and example surfaces from layout overflow.

## Run

```bash
npm run test:browser:dark-overflow
```

The script starts Vite, checks critical routes, and audits CSS contracts that prevent dark panels from clipping content.

## Routes

- `/doc`
- `/readme`
- `/benchmark`
- `/examples/showcase/`
- `/examples/canvas-basic/`

## What To Look For Manually

- dark backgrounds remain consistent
- code blocks scroll horizontally
- side panels and live controls can scroll
- canvases and media stay inside their parent width
- buttons and labels do not overlap

# Post-Release Consumer Audit

Ye audit Raw2D ko bahar se check karta hai, bilkul waise jaise ek naya npm user use karega.

## Goal

Confirm karo ki published packages, CDN files, docs snippets, examples, aur Studio docs workspace paths ke bina kaam karte hain.

## Fresh Install Matrix

Temporary projects me ye commands run karo:

```bash
npm install raw2d
npm install raw2d-core raw2d-canvas raw2d-webgl raw2d-sprite raw2d-text
npm install raw2d-mcp
npm install raw2d-react react react-dom
```

## Runtime Checks

Har app build hona chahiye aur ek real scene render karna chahiye:

- Canvas basic scene.
- WebGL basic scene.
- Sprite aur Texture Atlas scene.
- Interaction select, drag, resize scene.
- React adapter scene.
- MCP scene JSON helper import.
- Studio demo checklist route aur `/studio` route.

## Snippet Checks

Docs aur README snippets sirf package imports use karein:

```ts
import { Scene, Camera2D } from "raw2d";
import { CanvasRenderer } from "raw2d-canvas";
import { WebGLRenderer2D } from "raw2d-webgl";
```

`src/`, relative internals, ya workspace aliases wale snippets accept mat karo.

## Pass Criteria

Audit tab pass hai jab:

- `npm view raw2d version` expected release dikhaye.
- jsDelivr same release return kare.
- Fresh apps install aur build ho jayein.
- `npm run build` har generated app me pass ho.
- Canvas, WebGL, Sprite, Texture Atlas, aur Interaction examples visibly render hon.
- `/doc`, `/readme`, `/studio`, aur Studio demo checklist docs release ke baad load hon.
- Pinned jsDelivr ESM aur UMD URLs expected version return karein.

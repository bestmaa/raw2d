# Raw2D Studio Boundary

Raw2D Studio pehle is repository me ek separate app ke roop me start hona chahiye. Publishable package tab banana chahiye jab editor API stable ho.

## Location

MVP app package runtime code ke bahar rahega:

```text
apps/studio
```

Isse editor UI, application state, panels, aur build tooling `packages/core`, `packages/canvas`, `packages/webgl`, aur `packages/interaction` se alag rahenge.

## Package Plan

Studio later package ban sakta hai:

```text
raw2d-studio
```

Ye package Raw2D modules par depend karega. Umbrella `raw2d` package ise re-export nahi karega.

## Dependency Direction

Studio Raw2D packages import kar sakta hai:

```text
apps/studio -> raw2d-core
apps/studio -> raw2d-canvas
apps/studio -> raw2d-webgl
apps/studio -> raw2d-interaction
apps/studio -> raw2d-sprite
apps/studio -> raw2d-text
```

Raw2D packages Studio ko import nahi karenge.

## Shared Code Rule

Agar Studio ko reusable logic chahiye, to use focused runtime package me tabhi rakho jab woh editor ke bahar bhi useful ho.

Examples:

- Hit testing `raw2d-interaction` me belong karta hai.
- Scene JSON helpers `raw2d-core` me ja sakte hain agar woh UI-free rahen.
- Panel state, toolbar state, aur editor commands Studio me belong karte hain.

## Release Rule

Studio core package releases ko block nahi karega. Core renderer work editor changes ke bina ship ho sakta hai.

Studio package banne ke baad uski release aur notes alag ho sakte hain.

## Verification

- Runtime packages me Studio imports nahi.
- `packages/*` ke andar editor UI code nahi.
- Studio docs app/package separation explain karein.
- Future `apps/studio` independently build hona chahiye.

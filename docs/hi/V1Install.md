# V1 Install Aur Package Split

Raw2D me ek beginner-friendly umbrella package hai aur kuch focused packages hain.

## Recommended Install

Pehle `raw2d` use karein:

```bash
npm install raw2d
```

Is package me stable app-facing API milti hai: scene objects, materials, Canvas, WebGLRenderer2D, textures, sprites, text, interaction tools aur common helpers.

## Focused Packages

Focused packages tab install karein jab aapko module boundary clear chahiye:

```bash
npm install raw2d-core raw2d-canvas raw2d-webgl raw2d-sprite raw2d-text raw2d-interaction raw2d-react raw2d-mcp
```

- `raw2d-core`: scene graph, objects, materials, math, bounds aur hit testing.
- `raw2d-canvas`: Canvas renderer aur Canvas-specific drawing helpers.
- `raw2d-webgl`: WebGL2 renderer, batching, buffers, shaders aur diagnostics.
- `raw2d-sprite`: textures, atlases, atlas packing aur sprite animation.
- `raw2d-text`: Text2D measurement aur text helpers.
- `raw2d-interaction`: selection, dragging, resizing, keyboard aur camera controls.
- `raw2d-react`: React bridge package. Non-React apps me ise install karna zaruri nahi.
- `raw2d-mcp`: scene JSON, docs snippets aur visual-check plans ke automation tools.

## Import Rule

App docs aur examples me `raw2d` se import karein:

```ts
import { BasicMaterial, Camera2D, Canvas, Rect, Scene } from "raw2d";
```

Engine-builder docs focused packages use kar sakte hain:

```ts
import { Rect, Scene } from "raw2d-core";
import { WebGLRenderer2D } from "raw2d-webgl";
```

## Version Rule

Raw2D packages ek saath release hote hain. Agar kisi focused package me internal change nahi hua, tab bhi uska version umbrella package ke saath aligned rahega taaki npm users ko ek clear release train dikhe.

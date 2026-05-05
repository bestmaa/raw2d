# Raw2D Studio Scope

Raw2D Studio ek visual editor plan hai jo Raw2D ke upar banega. Ye core renderer packages ke andar mix nahi hoga.

## Product Goal

Studio ka goal hai developers aur designers ko Raw2D scene visually banane, scene graph inspect karne, aur scene data ya image export karne ka clear workflow dena.

Pehla version ek focused editor hona chahiye, full Photoshop replacement nahi.

## MVP Scope

- Canvas workspace jisme pan aur zoom ho.
- Rect, Circle, Line, Text2D, Sprite, aur basic paths add karna.
- Object select, drag, resize, rotate, aur origin edit karna.
- Properties panel me transform, material, text, aur sprite fields edit karna.
- Layers panel me scene order, visibility, lock, aur names manage karna.
- Assets panel me images aur texture atlas inputs rakhna.
- CanvasRenderer aur WebGLRenderer2D ke beech renderer switch.
- Raw2D scene JSON save aur load.
- Visible canvas se PNG export.
- Renderer stats dikhana: draw calls, texture binds, aur object count.

## Non-Goals

- Pehle version me full Photoshop clone nahi.
- Advanced photo editing, brush engine, filters, aur masking pipeline nahi.
- Physics editor nahi.
- First pass me timeline animation editor nahi.
- Plugin marketplace abhi nahi.
- Aisa hidden renderer magic nahi jo Raw2D ke transparent pipeline se conflict kare.
- Core users ko Studio install karne ke liye force nahi karna.

## Package Boundary

Studio app ya baad ke package ke roop me alag rehna chahiye.

```text
raw2d-core        scene objects, math, materials
raw2d-canvas      Canvas renderer
raw2d-webgl       WebGL renderer
raw2d-interaction selection, hit testing, drag, resize
raw2d-studio      visual editor app, baad ka package
```

Core packages Studio ke bina bhi usable rehne chahiye.

## Design Principle

Studio Raw2D ko practical prove karega, lekin engine ko heavy nahi banayega.

Editor existing modules compose karega, UI state add karega, aur scenes serialize karega. Renderer drawing ke liye responsible rahega, aur objects scene data store karenge.

## Verification

- Studio feature implement karne se pehle yeh scope padho.
- Jo feature future advanced editor phase me belong karta hai, use MVP se bahar rakho.
- Studio code ko core package internals se alag rakho.
- Examples aur docs npm users ke liye copy karne layak clear rakho.

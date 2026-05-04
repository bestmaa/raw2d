# Raw2D Studio Shell

Raw2D Studio future visual editor hai jisse Raw2D scenes banaye, inspect kare, aur export kare ja sakenge. Ye abhi `apps/studio` me alag app ke roop me shuru ho raha hai.

## Alag Kyun Hai

Studio Raw2D packages ko use kar sakta hai, lekin Raw2D packages Studio UI ko import nahi karenge.

```text
apps/studio -> raw2d packages
raw2d packages -> Studio import nahi
```

## Local Run

```bash
npm --prefix apps/studio run dev
```

Jo `/studio/` URL print ho, usko browser me open kare. Pehle shell me topbar, tools panel, canvas workspace, layers, properties, aur status bar hai.

## Build

```bash
npm --prefix apps/studio run build
```

Build output `dist-studio` me jata hai. Ye git me commit nahi hota.

## Abhi Ka Scope

- Editor layout shell.
- Canvas workspace placeholder.
- Tools, layers, properties, aur actions surface.
- Abhi scene mutation nahi.
- Abhi renderer coupling nahi.

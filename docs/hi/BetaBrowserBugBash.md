# Beta Browser Bug Bash

Public beta release se pehle docs, examples, CDN smoke page, aur Studio entry points ko real user ki tarah verify karne ke liye ye checklist use karo.

## Routes

Ye routes direct open karo:

```text
http://localhost:5174/doc
http://localhost:5174/readme
http://localhost:5174/examples/
http://localhost:5174/studio
http://localhost:5174/cdn-smoke
https://raw2d.com/doc
https://raw2d.com/readme
https://raw2d.com/examples/
https://raw2d.com/studio
https://raw2d.com/cdn-smoke
```

Har route blank screen, missing asset error, ya fatal console error ke bina load hona chahiye.

## `/doc` Checks

- `Canvas`, `WebGL`, `Sprite`, `Interaction`, `React`, aur `MCP` search karo
- alag groups ke results click karo
- English aur Hinglish switch karo
- code blocks aur live examples open karo
- sidebar ko top se bottom tak scroll karo

## `/readme` Checks

- install aur getting-started docs open karo
- examples aur CDN smoke docs open karo
- English aur Hinglish switch karo
- long code blocks readable rahen
- next/previous navigation kaam kare

## `/examples` Checks

- examples index open karo
- Canvas basic, WebGL basic, showcase, interaction, camera, aur React examples open karo
- har route par visible canvas ya example controls dikhein
- koi route Vite import error na dikhaye

## `/studio` Checks

- docs app ka public `/studio` route open karo
- Studio planning links scope, tools, aur panel docs kholen
- save, load, aur export workflows accept karne se pehle separate `apps/studio` browser smoke run karo

## CDN Smoke Checks

- `/cdn-smoke` open karo
- pinned URL text current package version se match kare
- release publish ke baad pinned jsDelivr ESM aur UMD URLs 200 return karein

## Pass Criteria

Bug bash tab pass hai jab:

- saare listed routes 200 return karein
- navigation aur search usable rahein
- severe layout overflow content hide na kare
- fatal browser console errors na aayen
- `npm run build:docs` aur `npm run test:browser` pass hon

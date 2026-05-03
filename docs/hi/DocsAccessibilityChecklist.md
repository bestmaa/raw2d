# Docs Accessibility Smoke Checklist

Docs UI ya live control changes accept karne se pehle ye checklist use karo.

## Keyboard Navigation

- `/doc` me Tab se navigate karo.
- Shift+Tab se controls me wapas jao.
- Enter focused buttons, links, details, aur toggles activate kare.
- Temporary UI ho to Escape close kare.
- Search mouse ke bina usable rehna chahiye.

## Readable Controls

- Focus state visible ho.
- Labels readable hon.
- Desktop aur mobile widths par text clipped na ho.
- English/Hinglish toggle clear ho.
- Left navigation scroll ho sake.
- Right live controls usable rahein.

## Canvas And WebGL Examples

Canvas output ke paas text hona chahiye jo visible result explain kare. WebGL
stats, interaction selected state, aur visual test results readable text hone
chahiye, sirf canvas-only information nahi.

## Smoke Routes

Commit se pehle real browser me `/doc`, `/doc#canvas-init`,
`/doc#webgl-renderer`, aur `/doc#interaction-controller` open karo.

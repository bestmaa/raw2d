# CDN Beta Smoke

Ye smoke check public beta releases ke liye Raw2D browser CDN path verify karta hai.

## Route

Local ya deployed smoke page open karo:

```bash
http://localhost:5174/cdn-smoke
https://raw2d.com/cdn-smoke
```

Page pinned jsDelivr URLs aur browser module import snippet dikhata hai.

## Pinned Check

Publish se pehle dry pinned URL check run karo:

```bash
npm run test:cdn:pinned
```

Live check sirf npm publish ke baad run karo:

```bash
npm run test:cdn:pinned -- --live
```

## Expected URLs

```bash
https://cdn.jsdelivr.net/npm/raw2d@1.13.8/dist/raw2d.js
https://cdn.jsdelivr.net/npm/raw2d@1.13.8/dist/raw2d.umd.cjs
```

## Pass Criteria

Smoke tab pass hai jab:

- `/cdn-smoke` Vite ke through load ho.
- page pinned ESM aur UMD URLs include kare.
- dry check `cdn-pinned-ok` print kare.
- live check npm publish ke baad success return kare.

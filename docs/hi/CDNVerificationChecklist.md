# jsDelivr CDN Verification Checklist

npm publish ke baad ye checklist use karo taki CDN consumers Raw2D load kar sakein.

## Pinned Version URLs

Pinned URLs release ke liye source of truth hain:

```sh
curl -I https://cdn.jsdelivr.net/npm/raw2d@VERSION/dist/raw2d.js
curl -I https://cdn.jsdelivr.net/npm/raw2d@VERSION/dist/raw2d.umd.cjs
```

Dono 200 aur JavaScript content return karne chahiye.

## Latest URLs

Pinned URLs work karne ke baad hi latest check karo:

```sh
curl -I https://cdn.jsdelivr.net/npm/raw2d/dist/raw2d.js
curl -I https://cdn.jsdelivr.net/npm/raw2d/dist/raw2d.umd.cjs
```

`latest` npm se thoda late update ho sakta hai.

## Browser Import

Browser module script me pinned ESM URL use karo. `Scene`, `Camera2D`, aur
`CanvasRenderer` se small scene banao taki confirm ho ki CDN build bundler alias
ke bina work kar raha hai.

## Failure Checks

- `npm view raw2d version` verify karo.
- Latest stale ho to pinned URLs prefer karo.
- `https://www.jsdelivr.com/package/npm/raw2d` check karo.
- Latest CDN URL resolve hone se pehle CDN support announce mat karo.

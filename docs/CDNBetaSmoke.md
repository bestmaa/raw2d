# CDN Beta Smoke

This smoke check verifies the Raw2D browser CDN path for public beta releases.

## Route

Open the local or deployed smoke page:

```bash
http://localhost:5174/cdn-smoke
https://raw2d.com/cdn-smoke
```

The page shows pinned jsDelivr URLs and a browser module import snippet.

## Pinned Check

Run the dry pinned URL check before publish:

```bash
npm run test:cdn:pinned
```

Run the live check only after the version is published to npm:

```bash
npm run test:cdn:pinned -- --live
```

## Expected URLs

```bash
https://cdn.jsdelivr.net/npm/raw2d@1.15.4/dist/raw2d.js
https://cdn.jsdelivr.net/npm/raw2d@1.15.4/dist/raw2d.umd.cjs
```

## Pass Criteria

The smoke passes when:

- `/cdn-smoke` loads through Vite.
- the page includes pinned ESM and UMD URLs.
- the dry check prints `cdn-pinned-ok`.
- the live check returns success after npm publish.

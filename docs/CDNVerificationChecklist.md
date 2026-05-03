# jsDelivr CDN Verification Checklist

Use this checklist after npm publish to confirm CDN consumers can load Raw2D.

## Pinned Version URLs

Pinned URLs are the source of truth for a release:

```sh
curl -I https://cdn.jsdelivr.net/npm/raw2d@VERSION/dist/raw2d.js
curl -I https://cdn.jsdelivr.net/npm/raw2d@VERSION/dist/raw2d.umd.cjs
```

Both should return 200 and JavaScript content.

## Latest URLs

Check latest only after pinned URLs work:

```sh
curl -I https://cdn.jsdelivr.net/npm/raw2d/dist/raw2d.js
curl -I https://cdn.jsdelivr.net/npm/raw2d/dist/raw2d.umd.cjs
```

`latest` can lag behind npm for a short time.

## Browser Import

Use a browser module script with the pinned ESM URL. Create a small scene using
`Scene`, `Camera2D`, and `CanvasRenderer` to confirm the CDN build works without
bundler aliases.

## Failure Checks

- Verify `npm view raw2d version`.
- Prefer pinned URLs when latest is stale.
- Check `https://www.jsdelivr.com/package/npm/raw2d`.
- Do not announce latest CDN support until the CDN URL resolves.

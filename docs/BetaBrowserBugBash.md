# Beta Browser Bug Bash

Use this checklist before a public beta release to verify the docs, examples, CDN smoke page, and Studio entry points like a real user.

## Routes

Open these routes directly:

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

Each route should load without a blank screen, missing asset error, or fatal console error.

## `/doc` Checks

- search for `Canvas`, `WebGL`, `Sprite`, `Interaction`, `React`, and `MCP`
- click results from different groups
- switch English and Hinglish
- open code blocks and live examples
- scroll the sidebar from top to bottom

## `/readme` Checks

- open install and getting-started docs
- open examples and CDN smoke docs
- switch English and Hinglish
- verify long code blocks remain readable
- confirm next/previous navigation still works

## `/examples` Checks

- open the examples index
- open Canvas basic, WebGL basic, showcase, interaction, camera, and React examples
- confirm every route has visible canvases or example controls
- confirm no route shows a Vite import error

## `/studio` Checks

- open the public `/studio` route from the docs app
- confirm Studio planning links open scope, tools, and panel docs
- run the separate `apps/studio` browser smoke before accepting save, load, and export workflows

## CDN Smoke Checks

- open `/cdn-smoke`
- confirm the pinned URL text matches the current package version
- after release publishing, confirm pinned jsDelivr ESM and UMD URLs return 200

## Pass Criteria

The bug bash passes when:

- all listed routes return 200
- navigation and search remain usable
- no severe layout overflow hides content
- no fatal browser console errors appear
- `npm run build:docs` and `npm run test:browser` pass

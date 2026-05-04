# Beta Browser Bug Bash

Use this checklist before a public beta release to verify the docs like a real user.

## Routes

Open these routes directly:

```text
http://localhost:5174/doc
http://localhost:5174/readme
https://raw2d.com/doc
https://raw2d.com/readme
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

## Pass Criteria

The bug bash passes when:

- both routes return 200
- navigation and search remain usable
- no severe layout overflow hides content
- no fatal browser console errors appear
- `npm run build:docs` and `npm run test:browser` pass

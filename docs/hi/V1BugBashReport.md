# v1 Bug Bash Report

Status: v1.25.4 ke liye passed.

Publish task se pehle final release-candidate bug bash ka record yahi hai.

## Scope

- Docs aur README routes: `/doc`, `/readme`, search, Hinglish mode, aur release readiness topics.
- Examples: examples index, Canvas basic, WebGL basic, showcase, interaction, camera, React, aur CDN smoke routes.
- Studio: public `/studio` route, plus Studio unit aur browser smoke checks for editing workflows.
- Runtime packages: Canvas, WebGL, Sprite, Text, Effects, Interaction, MCP, React, aur React Fiber.
- Package readiness: fixed versions, pack dry-run, package audit, fresh consumer installs, aur pinned CDN URL shape.

## Checks

```sh
npm test
npm run build:docs
npm run test:browser
npm run test:browser:mobile-docs
npm run test:browser:dark-overflow
npm run audit:package
npm run test:consumer
npm run pack:check -- --silent
npm run test:cdn:pinned
node scripts/audit-doc-links.mjs
```

## Findings

- Fixed: active docs snippets me stale `v0.10.9`, `0.9.9`, aur `localhost:5197` ab release placeholders ya default `5174` dev port use karte hain.
- Fixed: CDN smoke page ab saare pinned URLs ek `pinnedVersion` value se banata hai.
- Fixed: package metadata dependency audit expected Raw2D version ko root `package.json` se derive karta hai.
- Deferred: root `README.md` 250-line file rule se upar hai, lekin us file me unrelated user edits hain. User edits safe rakhte hue README trim dedicated follow-up me karna chahiye.
- Docs/readme aur runtime/package subagent inspections se koi blocker remaining nahi hai.

## Results

- `npm test`: passed, 682/682.
- `npm run build:docs`: passed.
- `npm run test:browser`: passed, 13/13.
- `npm run test:browser:mobile-docs`: passed.
- `npm run test:browser:dark-overflow`: passed.
- `npm run audit:package`: passed, issues 0.
- `npm run test:consumer`: passed.
- `npm run pack:check -- --silent`: passed, saare 11 package tarballs `1.25.4` par.
- `npm run test:cdn:pinned`: passed for umbrella aur focused package URLs at `1.25.4`.
- `node scripts/audit-doc-links.mjs`: passed, 258 markdown files, 128 doc topics, 85 readme topics.

## Pass Criteria

Bug bash pass ho gaya kyunki unresolved blocker nahi hai, listed commands pass hue, aur only deferred finding user-owned README edit tak isolated hai.

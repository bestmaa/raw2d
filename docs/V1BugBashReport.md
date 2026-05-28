# v1 Bug Bash Report

Status: passed for v1.25.4.

Use this report as the final release-candidate bug bash record before moving to the publish task.

## Scope

- Docs and README routes: `/doc`, `/readme`, search, Hinglish mode, and release readiness topics.
- Examples: examples index, Canvas basic, WebGL basic, showcase, interaction, camera, React, and CDN smoke routes.
- Studio: public `/studio` route plus Studio unit and browser smoke coverage for editing workflows.
- Runtime packages: Canvas, WebGL, Sprite, Text, Effects, Interaction, MCP, React, and React Fiber.
- Package readiness: fixed versions, pack dry-run, package audit, fresh consumer installs, and pinned CDN URL shape.

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

- Fixed: stale `v0.10.9`, `0.9.9`, and `localhost:5197` active docs snippets now use release placeholders or the default `5174` dev port.
- Fixed: CDN smoke page now builds all pinned URLs from a single `pinnedVersion` value.
- Fixed: package metadata dependency audit now derives the expected Raw2D version from root `package.json`.
- Deferred: root `README.md` is over the 250-line file rule, but that file currently has unrelated user edits. Keep the user edits intact and trim README in a dedicated follow-up only after those changes are owned by the release task.
- No blocker remains from the docs/readme or runtime/package subagent inspections.

## Results

- `npm test`: passed, 682/682.
- `npm run build:docs`: passed.
- `npm run test:browser`: passed, 13/13.
- `npm run test:browser:mobile-docs`: passed.
- `npm run test:browser:dark-overflow`: passed.
- `npm run audit:package`: passed, issues 0.
- `npm run test:consumer`: passed.
- `npm run pack:check -- --silent`: passed, all 11 package tarballs at `1.25.4`.
- `npm run test:cdn:pinned`: passed for umbrella and focused package URLs at `1.25.4`.
- `node scripts/audit-doc-links.mjs`: passed, 258 markdown files, 128 doc topics, 85 readme topics.

## Pass Criteria

The bug bash passed because no unresolved blocker remains, all listed commands passed, and the only deferred finding is isolated to a user-owned README edit.

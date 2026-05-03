---
name: raw2d-package-audit
description: Audit Raw2D workspace packages, exports, version sync, package contents, bundle size, CDN readiness, consumer installs, GitHub workflow readiness, and release notes. Use before release tasks, npm publish tags, package-boundary changes, or public API stabilization work.
---

# Raw2D Package Audit

Use this skill before publishing or when package exports, versions, dependencies, or public API names change.

## Audit Order

1. Check `package.json`, workspace package manifests, and `package-lock.json` are synchronized.
2. Confirm all Raw2D package versions and internal dependencies match the target version.
3. Inspect `exports`, `files`, `types`, `main`, `module`, `sideEffects`, license, author, README, NOTICE, and package scope.
4. Run public API export tests and package dry-run.
5. Run consumer install smoke from a clean temp project.
6. Check docs install snippets and CDN examples use the intended package/version.
7. For release tasks, confirm release notes exist before tag push.

## Commands

Use the full package gate:

```bash
npm run typecheck
npm test
npm run build:docs
npm run pack:check -- --silent
npm run test:consumer
git diff --check
```

Use npm metadata checks after publish:

```bash
npm view raw2d version
npm view raw2d-core version
npm view raw2d-webgl version
npm view raw2d-mcp version
```

## Release Rules

- Do not push or publish unless the user requested it or the task is a release task.
- Prefer GitHub tag workflow publishing over local `npm publish`.
- Release tags must match package versions, for example `v0.8.12`.
- Include release notes that list added, changed, verification, and package names.
- After tag push, verify GitHub CI, publish workflow, npm versions, jsDelivr, and docs URL.

## Boundaries

- Do not bundle plugin files into runtime npm packages.
- Do not ship `AGENTS.md`.
- Keep focused package dependency direction clean.
- Avoid adding broad dependencies for audit-only needs.

## Summary

Report target version, package list checked, command results, published versions if applicable, CDN/docs checks, and any package risk.


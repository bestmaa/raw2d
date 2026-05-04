# Product Docs Snippet Audit

This audit checks the snippets a beginner is most likely to copy from Raw2D product docs.

## Why It Exists

Docs can look correct while examples drift away from the real package API. The audit reads selected markdown docs, extracts TypeScript snippets, installs packed Raw2D packages in a fresh temporary TypeScript app, and runs `tsc --noEmit`.

## Run

```bash
npm run test:snippets:product
```

The normal test suite also runs this audit through `tests/docs/product-docs-snippets.test.mjs`.

## Covered Docs

- `GettingStarted.md`
- `Examples.md`
- `V1Install.md`
- `UmbrellaBetaInstallAudit.md`
- `CanvasFocusedInstallAudit.md`
- `WebGLFocusedInstallAudit.md`
- `PostReleaseAuditPlan.md`
- `CDNBetaSmoke.md`

## Pass Criteria

- snippets import from public package names only
- snippets compile in strict TypeScript
- packed local packages install in the temporary app
- CDN-only browser snippets stay documented but are not compiled before publish

## When To Update

Add a doc to this audit when it contains user-facing TypeScript setup code. Keep internal-only design notes out unless users are expected to copy the snippet.

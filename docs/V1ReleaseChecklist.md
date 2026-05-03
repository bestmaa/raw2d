# v1.0 Release Checklist

Use this checklist before Raw2D is marked as v1 stable.

## API Freeze

- Package export maps are root-only and stable.
- Runtime exports match audited snapshots.
- Constructor option names are stable.
- Renderer lifecycle methods are stable.
- Deprecated aliases are documented before removal.

## Renderer Stability

- CanvasRenderer remains the complete reference renderer.
- WebGLRenderer2D documents supported objects and fallback behavior.
- WebGL diagnostics keep stable field names.
- Bundle size audit passes.

## Docs And Examples

- `/doc`, `/readme`, `/benchmark`, and `/visual-test` open in a browser.
- Every example route opens without console errors.
- Search works.
- Hinglish mode works.
- Small and full examples match the feature being documented.

## Package Metadata

- Every package includes README, LICENSE, NOTICE, and TRADEMARKS.
- Every package has repository, issue, homepage, and keyword metadata.
- `npm pack --workspaces --dry-run` shows the expected package files.

## Publish Verification

- Release notes include the version.
- Git tag is pushed.
- GitHub Actions CI and Publish pass.
- npm versions are visible.
- jsDelivr URLs return 200.
- `https://raw2d.com/doc` returns 200.

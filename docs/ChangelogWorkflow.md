# Changelog Workflow Notes

Use this workflow to keep Raw2D release history readable and honest.

## When To Update

Update changelog notes when a task changes:

- Public API names.
- Package exports.
- Canvas or WebGL renderer behavior.
- Renderer diagnostics.
- npm package metadata.
- Docs deployment behavior.
- Release verification steps.

## Entry Shape

Use this shape for each release:

```md
## vVERSION

### Added
### Changed
### Fixed
### Breaking Changes
### Known Limits
### Verification
```

## Rules

- Do not claim unpublished work.
- Do not hide breaking changes inside Added.
- Keep internal-only refactors out unless users are affected.
- Make verification specific.
- Keep release notes, changelog, git tag, and npm version consistent.

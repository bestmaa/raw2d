# Changelog Workflow Notes

Raw2D release history readable aur honest rakhne ke liye ye workflow use karo.

## When To Update

Changelog notes tab update karo jab task me ye change ho:

- Public API names.
- Package exports.
- Canvas ya WebGL renderer behavior.
- Renderer diagnostics.
- npm package metadata.
- Docs deployment behavior.
- Release verification steps.

## Entry Shape

Har release ke liye ye shape use karo:

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

- Unpublished work claim mat karo.
- Breaking changes ko Added ke andar hide mat karo.
- Internal-only refactors tabhi mention karo jab users affected hon.
- Verification specific rakho.
- Release notes, changelog, git tag, aur npm version consistent rakho.

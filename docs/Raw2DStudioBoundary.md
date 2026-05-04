# Raw2D Studio Boundary

Raw2D Studio should begin as a separate app in this repository, then become a publishable package only after the editor API is stable.

## Location

The MVP app should live outside package runtime code:

```text
apps/studio
```

This keeps editor UI, application state, panels, and build tooling away from `packages/core`, `packages/canvas`, `packages/webgl`, and `packages/interaction`.

## Package Plan

Studio can become a package later:

```text
raw2d-studio
```

That package should depend on Raw2D modules instead of being re-exported by the umbrella `raw2d` package.

## Dependency Direction

Studio may import Raw2D packages:

```text
apps/studio -> raw2d-core
apps/studio -> raw2d-canvas
apps/studio -> raw2d-webgl
apps/studio -> raw2d-interaction
apps/studio -> raw2d-sprite
apps/studio -> raw2d-text
```

Raw2D packages must not import Studio.

## Shared Code Rule

If Studio needs reusable logic, put it in focused runtime packages only when that logic is useful outside the editor.

Examples:

- Hit testing belongs in `raw2d-interaction`.
- Scene JSON helpers can live in `raw2d-core` if they remain UI-free.
- Panel state, toolbar state, and editor commands belong in Studio.

## Release Rule

Studio should not block core package releases. Core renderer work can ship without editor changes.

Studio releases can happen later with their own version and notes if it becomes a package.

## Verification

- No Studio imports in runtime packages.
- No editor UI code inside `packages/*`.
- Studio docs must explain app/package separation.
- Future `apps/studio` should build independently.

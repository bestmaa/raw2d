# Raw2D Studio Shell

Raw2D Studio is the future visual editor for Raw2D scenes. It starts as a separate app in `apps/studio` so runtime packages stay small.

## Why It Is Separate

The editor can import Raw2D packages, but Raw2D packages must not import editor code.

```text
apps/studio -> raw2d packages
raw2d packages -> no Studio imports
```

## Run Locally

```bash
npm --prefix apps/studio run dev
```

Open the printed `/studio/` URL. The first shell includes a topbar, tools panel, canvas workspace, layers, properties, and status bar.

## Build

```bash
npm --prefix apps/studio run build
```

The build output goes to `dist-studio`, which is ignored by git.

## Current Scope

- Editor layout shell.
- Canvas workspace placeholder.
- Tool, layer, property, and action surfaces.
- No scene mutation yet.
- No renderer coupling yet.

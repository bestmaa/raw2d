# raw2d-react

React bridge package scaffold for Raw2D.

This package is intentionally minimal right now. It exists so the React phase can grow in a separate package without changing `raw2d-core`, `raw2d-canvas`, or `raw2d-webgl`.

```bash
npm install raw2d raw2d-react react
```

Current status:

- package boundary only
- no JSX runtime yet
- no renderer API changes
- no React dependency inside Raw2D runtime packages

Planned direction:

- `<Raw2DCanvas>` component
- explicit Canvas/WebGL renderer selection
- JSX scene, camera, object, and material mapping
- lifecycle cleanup for objects, listeners, and textures


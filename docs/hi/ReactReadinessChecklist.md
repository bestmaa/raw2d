# Final React Package Readiness Checklist

`raw2d-react` ko early users ke liye ready bolne se pehle ye checklist use karo.

## Package Boundary

- `raw2d-react` adapter package hai.
- React `raw2d-core` me nahi jana chahiye.
- React `raw2d-canvas` me nahi jana chahiye.
- React `raw2d-webgl` me nahi jana chahiye.
- React sprite, text, ya effects packages me nahi jana chahiye.

## Consumer Build

```sh
npm run build --workspace raw2d-react
node --test tests/react/*.test.mjs
```

Consumer app Vite aur React ke saath build hona chahiye. JSX primitives Raw2D
objects par map hone chahiye, renderer pipeline ko hide kiye bina.

## Docs

- React docs me package optional hai ye likha hona chahiye.
- React docs me package early hai ye likha hona chahiye.
- React docs runtime boundary explain karein.
- `/examples/react-basic/` browser me load hona chahiye.

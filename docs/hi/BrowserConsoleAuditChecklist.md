# Browser Console Error Audit

Docs, examples, ya release verification accept karne se pehle ye checklist use karo.

## Routes

- `/doc` open karo.
- `/readme` open karo.
- `/benchmark` open karo.
- `/visual-test` open karo.
- `/examples/canvas-basic/` open karo.
- `/examples/webgl-basic/` open karo.
- `/examples/interaction-basic/` open karo.

## Failing Console Output

- Uncaught `TypeError` ya `ReferenceError`.
- Failed dynamic module imports.
- 404 asset requests.
- WebGL context loss without recovery.
- Repeated warning loops.
- Missing texture ya font loading errors.

## Allowed Console Output

Unsupported browser par ek clear WebGL2 unavailable message acceptable hai.
Ye broken WebGL example ko hide nahi karna chahiye.

## Verification

`npm run test:browser`, `npm test`, aur `npm run build:docs` run karo. Release
tasks ke liye DevTools open karke ek manual browser pass bhi karo.

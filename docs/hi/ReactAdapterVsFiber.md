# React Adapter Vs Future Fiber

Raw2D me abhi `raw2d-react` ek simple React bridge hai. Future Fiber package jyada advanced hoga aur custom reconciler use karega.

## Current Package

`raw2d-react` tab use karo jab Raw2D ke upar small React wrapper chahiye.

```tsx
import { Raw2DCanvas, RawRect } from "raw2d-react";

<Raw2DCanvas renderer="canvas" width={800} height={480}>
  <RawRect x={80} y={80} width={160} height={96} fillColor="#35c2ff" />
</Raw2DCanvas>;
```

Ye package simple rakha gaya hai:

- samajhna easy
- examples aur small React apps ke liye good
- custom reconciler required nahi
- hidden renderer internals nahi

Current beta me ye sahi package hai jab React components chahiye, par Raw2D ka low-level API same rakhna hai.

## Future Fiber Package

Future `raw2d-react-fiber` custom reconciler use karega jab Raw2D ko deeper React integration chahiye.

```tsx
<Raw2DCanvas renderer="webgl" width={800} height={480}>
  <rawScene>
    <rawRect x={80} y={80} width={160} height={96} />
    <rawSprite x={320} y={96} texture={texture} />
  </rawScene>
</Raw2DCanvas>
```

Fiber tab useful hai jab Raw2D ko host nodes, commit batching, stable object identity, aur large JSX scene updates chahiye.

Fiber ko `raw2d-react` se alag rehna chahiye, taki current adapter simple aur audit-friendly rahe.

## Kaunsa Use Kare

Abhi `raw2d-react` use karo:

- React components quickly chahiye
- scene small ya medium hai
- explicit props aur simple rendering pasand hai
- custom reconciliation nahi chahiye

Fiber ka wait karo:

- large JSX scenes chahiye
- object identity aur update batching important hai
- deeper React-style scene graph chahiye
- lifecycle hooks aur renderer APIs stable hain

## Core Rule

Dono packages public Raw2D APIs ko wrap karenge. Kisi package ke wajah se non-React Raw2D users ke liye React required nahi hona chahiye.

`raw2d-core`, `raw2d-canvas`, aur `raw2d-webgl` React-free rahenge.

React support renderer choice hide nahi karega. Users ko Canvas ya WebGL explicitly choose karna chahiye.

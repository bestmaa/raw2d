# Object Lifecycle

Object lifecycle helpers scene ownership ko explicit banate hain, bina React ko core me add kiye.

## Ye Kyun Hai

Future adapters, jaise React Fiber-style package, ko pata hona chahiye ki Raw2D object kab attach, detach, ya dispose hua.

Raw2D ye lifecycle `raw2d-core` me rakhta hai, taki Canvas, WebGL, MCP, React, aur vanilla apps same rules use kar saken.

## Scene Aur Group Hooks

`Scene` aur `Group2D` lifecycle helpers automatically call karte hain.

```ts
const scene = new Scene();
const rect = new Rect({ width: 120, height: 80 });

scene.add(rect);
console.log(getObject2DLifecycleState(rect).parent === scene);

scene.remove(rect);
console.log(getObject2DLifecycleState(rect).parent);
```

## Adapter Ownership

Advanced adapters helpers ko direct call kar sakte hain.

```ts
const parent = { id: "react-root", name: "Raw2D React root" };

attachObject2D({ object: rect, parent });
detachObject2D({ object: rect, parent });
disposeObject2D(rect);
```

## State Shape

Lifecycle state jaan-boojhkar small rakha gaya hai.

```ts
const state = getObject2DLifecycleState(rect);

state.parent;   // Scene, Group2D, adapter parent, ya null
state.disposed; // disposeObject2D(rect) ke baad true
```

## Renderer Rule

Renderers lifecycle state own nahi karte. Renderer sirf scene read karke supported objects draw karta hai.

Lifecycle helpers ownership, cleanup, aur adapter reconciliation ke liye hain. Drawing abhi bhi renderer se hi hoti hai.

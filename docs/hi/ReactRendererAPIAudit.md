# React Renderer API Audit

Ye audit check karta hai ki Raw2D renderer APIs future React Fiber-style reconciler ke liye stable hain ya nahi.

## Audit Result

Raw2D ke public renderer APIs first Fiber design ke liye enough hain, lekin real reconciler se pehle lifecycle hooks add karne chahiye.

```txt
Current: JSX adapter public renderer APIs call kar sakta hai.
Needed: stable object attach/detach/update hooks.
Avoid: private renderer cache ya batch buffer access.
```

## Stable APIs

Future adapter in public APIs par depend kar sakta hai:

- `Scene.add(object)` aur `Scene.remove(object)`
- `Scene.traverse(callback)`
- `Canvas.render(scene, camera)`
- `Canvas.clear()`
- `Canvas.setSize(width, height)`
- `WebGLRenderer2D.render(scene, camera)`
- `WebGLRenderer2D.clear()`
- `WebGLRenderer2D.setSize(width, height)`
- public object transform fields
- public material fields aur setters

Ye APIs Raw2D ke explicit-control direction se match karte hain aur React-specific behavior require nahi karte.

## Reconciliation Needs

React reconciliation ko deterministic object ownership chahiye:

- JSX element ke liye Raw2D instance ek baar create karna
- props change hone par public fields update karna
- parent scene ya group me attach karna
- JSX element unmount hone par detach karna
- committed mutations ke baad render request karna
- owned listeners, textures, ya controller state cleanup karna

Adapter React-to-Raw2D instance map hold karega. Core ko React keys store nahi karna chahiye.

## Current Gap

Raw2D objects aaj add, remove, aur update ho sakte hain, lekin attach, detach, dispose, ya mutation notification ke liye formal lifecycle event nahi hai.

Ye gap important hai kyunki reconciler ko private fields read kiye bina cleanup aur render invalidation reliable chahiye.

## Required Core Additions

`raw2d-react-fiber` banane se pehle small lifecycle hooks add karo:

```ts
object.onAttach(parent);
object.onDetach(parent);
object.dispose();
object.markDirty();
```

Exact API badal sakta hai, lekin rule same rahe: lifecycle hooks core concepts hain, React sirf ek caller hai.

## Renderer Rule

Renderer APIs simple rehni chahiye:

```ts
renderer.render(scene, camera);
renderer.setSize(width, height);
renderer.clear();
renderer.dispose();
```

React decide karega ki ye methods kab call honge. Renderers React import nahi karenge, JSX read nahi karenge, aur reconciliation state own nahi karenge.

## Decision

Renderer APIs planning ke liye stable hain. Next implementation step object lifecycle hooks hona chahiye, phir JSX reconciler data model.

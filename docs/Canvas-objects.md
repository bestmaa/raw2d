# Canvas Object Methods

`Canvas` can store supported object data classes directly, but `Scene` is preferred for clearer structure.

Supported objects right now:

```ts
type CanvasObject = Rect | Circle | Line;
```

## `add()`

```ts
public add(object: CanvasObject): this
```

Adds a supported object to the canvas object list.

```ts
raw2dCanvas.add(rect);
raw2dCanvas.add(circle);
raw2dCanvas.add(line);
```

Preferred scene flow:

```ts
scene.add(rect);
scene.add(circle);
raw2dCanvas.render(scene, camera);
```

`add()` returns the same `Canvas` instance, so chaining is possible.

```ts
raw2dCanvas.add(rect).add(circle).add(line);
```

## `remove()`

```ts
public remove(object: CanvasObject): this
```

Removes an object from the canvas object list.

```ts
raw2dCanvas.remove(rect);
```

If the object is not present, nothing happens.

## `getObjects()`

```ts
public getObjects(): readonly CanvasObject[]
```

Returns the objects currently added to the canvas.

```ts
const objects = raw2dCanvas.getObjects();
```

The returned list is readonly from the public API.

## Render Order

Objects are rendered in the same order they were added.

```ts
raw2dCanvas.add(rect);
raw2dCanvas.add(circle);
raw2dCanvas.render();
```

In this example, `rect` renders first, then `circle`.

## Visibility

Invisible objects are skipped.

```ts
rect.visible = false;
raw2dCanvas.render();
```

## Important

This is the current MVP API. Drawing logic is handled by split canvas renderer modules, not by object classes.

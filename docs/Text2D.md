# Text2D

`Text2D` stores text object data.

It does not draw itself. Canvas renderer modules read `Text2D` data and draw it.

## Source Files

```text
src/objects/Text2D.ts
src/objects/Text2D.type.ts
```

## Create Text2D

```ts
const text = new Text2D({
  x: 80,
  y: 135,
  text: "Hello Raw2D",
  font: "32px sans-serif",
  material: new BasicMaterial({ fillColor: "#f5f7fb" })
});
```

## Options

```ts
interface Text2DOptions extends Object2DOptions {
  readonly text: string;
  readonly font?: string;
  readonly align?: CanvasTextAlign;
  readonly baseline?: CanvasTextBaseline;
  readonly material?: BasicMaterial;
}
```

## Render Text2D

```ts
const scene = new Scene();
const camera = new Camera2D();

scene.add(text);
raw2dCanvas.render(scene, camera);
```

## Update Text

```ts
text.setText("Updated text");
text.setFont("48px sans-serif");
raw2dCanvas.render(scene, camera);
```

## Live Example

Open:

```text
http://localhost:5174/doc#text2d
```

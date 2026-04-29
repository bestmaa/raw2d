# Text2D

`Text2D` stores text object data.

It does not draw itself. Canvas renderer modules read `Text2D` data and draw it. WebGLRenderer2D rasterizes `Text2D` to a texture and then draws that texture through the same ordered texture batch path as Sprites.

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

## Render With WebGL

```ts
const webglRenderer = new WebGLRenderer2D({ canvas: canvasElement });

scene.add(text);
webglRenderer.render(scene, camera);
```

WebGL text is intentionally explicit for now:

- text is rasterized to a small canvas texture
- changing text, font, fill color, stroke color, or line width rebuilds that texture
- stroke is drawn when `strokeColor` differs from `fillColor`
- the resulting texture is drawn through the texture batch path
- future work can replace this with glyph atlas or SDF text

## Update Text

```ts
text.setText("Updated text");
text.setFont("48px sans-serif");
raw2dCanvas.render(scene, camera);
```

For WebGL, render again after updating. The renderer cache will rebuild the text texture when the `Text2D` data changes.

## Live Example

Open:

```text
http://localhost:5174/doc#text2d
```

# Raw2D JSX Mapping Design

Future `raw2d-react` package JSX elements ko existing Raw2D classes se map karega. Rules simple aur predictable hone chahiye.

## Renderer

`Raw2DCanvas` canvas element own karega aur selected renderer create karega.

```tsx
<Raw2DCanvas renderer="canvas" width={800} height={480} />
<Raw2DCanvas renderer="webgl" width={800} height={480} />
```

## Scene Aur Camera

Scene aur camera explicit rehne chahiye taaki React users low-level Raw2D structure ko bhi samajh sakein.

```tsx
<Raw2DCanvas renderer="webgl">
  <rawScene>
    <rawCamera x={0} y={0} zoom={1} />
  </rawScene>
</Raw2DCanvas>
```

## Objects

Object names Raw2D class names ke close rahenge. HTML elements se conflict avoid karne ke liye `raw` prefix use hoga.

```tsx
<rawRect x={80} y={80} width={160} height={96} fillColor="#35c2ff" />
<rawCircle x={320} y={130} radius={48} fillColor="#facc15" />
<rawLine x={80} y={240} startX={0} startY={0} endX={260} endY={0} strokeColor="#f5f7fb" />
<rawText2D x={80} y={320} text="Raw2D" font="32px sans-serif" fillColor="#f5f7fb" />
```

## Materials

Pehla JSX bridge common style props accept kar sakta hai aur internally `BasicMaterial` create kar sakta hai. Advanced material objects baad me aa sakte hain.

```tsx
<rawRect fillColor="#35c2ff" strokeColor="#f5f7fb" lineWidth={2} />
```

## Update Rule

Prop updates sirf public object properties mutate karein. Agar object type ko special methods chahiye, bridge public methods jaise `setPoints` call kare.

## Identity Rule

React keys stable Raw2D object instances se map hone chahiye. JSX reorder hone par object recreate nahi hona chahiye, jab tak key ya element type change na ho.


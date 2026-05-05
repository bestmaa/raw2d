# Raw2D Studio Demo Checklist

Raw2D Studio ko publicly dikhane se pehle ye checklist use karein.

## Demo Route

- `npm --prefix apps/studio run dev` chalayein.
- Jo `/studio/` URL print ho, use browser me open karein.
- Topbar, tools, canvas, renderer switch, stats, layers, properties, aur status bar visible hon.

## Create Aur Edit

- Sample click karein aur confirm karein ki teen objects dikhte hain.
- Rect, Circle, Line, Text2D, aur Sprite add karein.
- Canvas aur Layers dono se object select karein.
- Selected object drag karein.
- Rect ya Sprite resize karein.
- Properties me transform, geometry, text, aur material fields edit karein.

## Persistence

- `.raw2d.json` file save karein.
- Saved file load karein aur object count, names, renderer mode, aur camera state round-trip confirm karein.
- Invalid JSON try karein aur status bar me import error confirm karein.
- PNG export karein aur downloaded file open karke dekhein.

## Responsive Check

- Studio app phone width par open karein.
- Layout stack ho, topbar actions wrap hon, panels scroll hon, aur canvas viewport ke andar rahe.

## Pass Criteria

Demo tab ready hai jab `npm run test:browser`, `npm --prefix apps/studio run build`, aur manual demo route pass hon.

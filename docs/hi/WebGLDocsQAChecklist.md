# WebGL Docs Visual QA Checklist

WebGL docs ya example change accept karne se pehle ye checklist follow karo.

## Routes

- `/doc#webgl-renderer` open karo.
- `/doc#webgl-performance` open karo.
- `/doc#webgl-visual-tests` open karo.
- `/benchmark` open karo.
- `/visual-test` open karo.
- `/examples/webgl-basic/` open karo.

## Visual Result

- WebGL canvas blank nahi hona chahiye.
- Supported shapes, sprites, text textures, aur path fallback output visible hona chahiye.
- Color, zIndex order, aur texture frames example code se match hone chahiye.
- Canvas se compare tabhi karo jab dono renderers same feature support karte hain.

## Diagnostics

- drawCalls check karo.
- textureBinds check karo.
- static cache hits aur misses check karo.
- unsupportedObjects check karo.
- WebGL2 unavailable message clear hona chahiye.

## Browser Check

Commit se pehle real browser me check karo. Route reload karo, viewport resize
karo, console errors dekho, aur confirm karo ki WebGL stats update ho rahe hain.

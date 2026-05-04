# Showcase Demo

Raw2D showcase ek real-world demo plan hai jisme ek hi scene ko Canvas aur WebGL dono renderer se chalaya jayega.

## Ye Kyun Hai

Raw2D ka goal sirf fast library banana nahi hai. Goal hai clear aur controllable rendering engine banana.

Showcase se developer ko ye samajh aana chahiye:

- Canvas kab use karna hai
- WebGL kab use karna hai
- atlas se kya fayda hota hai
- static aur dynamic batch ka impact kya hai
- culling aur interaction live scene me kaise kaam karte hain

## Scene Scope

Pehle showcase me ye cheezein honi chahiye:

- 300+ sprites
- 100+ simple shapes
- text labels
- static background objects
- dynamic selected objects
- camera pan aur zoom
- selection, drag, resize
- live renderer stats
- Canvas/WebGL renderer switch
- camera pan, zoom, reset, aur minimap viewport hints

## Performance Targets

Canvas target:

- correct visual output
- easy debugging
- reliable fallback path

WebGL target:

- batching se fewer draw calls
- atlas se lower texture binds
- clear static/dynamic batch stats

## Verification

Har showcase task ke baad ye checks chalne chahiye:

```bash
npm run typecheck
npm test
npm run build:docs
npm run test:browser
```

Manual browser checks me `/examples/showcase/` aur `/doc#showcase-demo` zarur dekhna hai.

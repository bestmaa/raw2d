# Showcase Demo

Raw2D showcase ek real-world demo hai jisme ek hi scene ko Canvas aur WebGL dono renderer se chalaya jata hai.

## Ye Kyun Hai

Raw2D ka goal sirf fast library banana nahi hai. Goal hai clear aur controllable rendering engine banana.

Showcase se developer ko ye samajh aana chahiye:

- Canvas kab use karna hai
- WebGL kab use karna hai
- atlas se kya fayda hota hai
- static aur dynamic batch ka impact kya hai
- culling aur interaction live scene me kaise kaam karte hain

## Ye Kya Prove Karta Hai

Showcase ek hi jagah par Raw2D ke main ideas prove karta hai:

- wahi `Scene` aur `Camera2D` Canvas aur WebGL dono me kaam karte hain
- Canvas readable correctness path hai
- WebGL batch-first performance path hai
- stats draw calls, texture binds, culling, aur cache behavior dikhate hain
- interaction object data change karta hai, phir renderer naya state draw karta hai

Raw2D transparent rehna chahiye. Is demo me renderer choices clearly dikhte hain, hidden framework magic nahi hota.

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
- selection, drag, resize, aur transform handles interaction tools se
- live renderer stats aur copyable performance report
- atlas sorting, static batch, dynamic mode, aur culling toggles

## Performance Targets

Canvas target:

- correct visual output
- easy debugging
- reliable fallback path

WebGL target:

- batching se fewer draw calls
- atlas se lower texture binds
- clear static/dynamic batch stats

## Demo Kaise Padhein

Canvas se start karein jab scene simple ho, debugging important ho, ya browser fallback reliable chahiye.

WebGL par switch karein jab scene me many sprites, repeated textures, ya bahut objects hon jahan batching aur culling useful ho.

Toggles ka use aise karein:

- atlas sorting: dekhein texture binds kam hote hain ya nahi
- static batches: dekhein background objects cached work reuse karte hain ya nahi
- culling: dekhein off-camera objects render work se skip hote hain ya nahi
- renderer switch: pehle correctness compare karein, phir performance

## Live Route

```text
/examples/showcase/
```

Written guide ke liye `/doc#showcase-demo` aur live scene ke liye `/examples/showcase/` open karein.

## Verification

Har showcase task ke baad ye checks chalne chahiye:

```bash
npm run typecheck
npm test
npm run build:docs
npm run test:browser
```

Manual browser checks me `/examples/showcase/` aur `/doc#showcase-demo` zarur dekhna hai.

# Raw2D Codex Plugin Design

Raw2D Codex plugin ka kaam contributors ko Raw2D feature banana, docs likhna, tests chalana aur browser me verify karna easy banana hai. Ye plugin browser runtime packages ke andar ship nahi hoga.

## Goal

Plugin Raw2D ko easy banayega, lekin engine pipeline ko hide nahi karega. Raw2D ki identity clear rahegi: Scene -> RenderList -> Batcher -> Buffer -> Shader -> DrawCall.

## Location

- Plugin folder: `plugins/raw2d`
- Required manifest: `plugins/raw2d/.codex-plugin/plugin.json`
- Optional folders: `skills`, `scripts`, `assets`, `mcp`
- Marketplace entry: `.agents/plugins/marketplace.json` tabhi jab repo Codex UI me plugin expose kare

Plugin `packages/*` ke bahar rahega. Isse npm browser packages clean aur lightweight rahenge.

## Manifest Plan

Plugin manifest ka normalized name `raw2d` hoga:

```json
{
  "name": "raw2d",
  "version": "0.1.0",
  "description": "Codex tools and skills for building, documenting, and visually testing Raw2D.",
  "interface": {
    "displayName": "Raw2D",
    "description": "Build Raw2D features with docs, examples, and visual verification."
  }
}
```

Scaffold task me Codex plugin schema ke required fields preserve honge aur missing values clearly fill kiye jayenge.

## Initial Capabilities

- Small Raw2D app scaffold karna.
- Feature docs English aur Hinglish guidance ke saath generate karna.
- Focused Canvas ya WebGL examples banana.
- Docs QA checks chalana.
- Visual pixel tests chalana.
- Renderer stats aur batching diagnostics explain karna.
- JSON scene generation aur inspection ke liye `raw2d-mcp` helpers call karna.

## Skill Plan

- `raw2d-doc-writer`: ek feature ke docs, readme notes aur examples likhe.
- `raw2d-feature-builder`: ek isolated Raw2D feature tests ke saath implement kare.
- `raw2d-visual-check`: docs/examples start karke browser me verify kare.
- `raw2d-package-audit`: exports, package size aur consumer install verify kare.

## Boundaries

- Normal plugin commands npm publish nahi karenge.
- Git push sirf release task me hoga.
- Unrelated packages edit nahi honge.
- React Fiber tab tak nahi jab tak core renderer API stable na ho.
- Commands deterministic honge aur touched files clearly batayenge.

## Verification

Har plugin command apna result clearly return kare:

- kaun se files create ya change huye
- kaun se tests chale
- kaun sa browser page check hua
- package ya docs output inspect hua ya nahi
- next suggested task kya hai


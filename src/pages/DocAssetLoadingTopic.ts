import type { DocTopic } from "./DocPage.type";

export const assetLoadingTopic: DocTopic = {
  id: "asset-loading",
  label: "Asset Loading",
  title: "Asset Loading",
  description: "TextureLoader, TextureAtlasLoader, and AssetGroupLoader keep image setup explicit and reusable.",
  sections: [
    {
      title: "Load Texture",
      body: "TextureLoader loads an image into a Texture. Enable cache when the same URL may be requested more than once.",
      liveDemoId: "texture-atlas",
      code: `const texture = await new TextureLoader({
  cache: true,
  crossOrigin: "anonymous"
}).load("/sprites/player.png");`
    },
    {
      title: "Load Asset Group",
      body: "AssetGroupLoader loads a manifest of textures and atlases, then returns typed getters for the loaded pack.",
      liveDemoId: "texture-atlas",
      code: `const assets = await new AssetGroupLoader().load({
  player: "/sprites/player.png",
  enemy: { type: "texture", url: "/sprites/enemy.png" },
  playerAtlas: { type: "atlas", url: "/sprites/player.atlas.json" }
});

const playerTexture = assets.getTexture("player");
const playerAtlas = assets.getAtlas("playerAtlas");`
    },
    {
      title: "Progress",
      body: "Use onProgress for loading screens. The callback runs after each asset succeeds or fails.",
      liveDemoId: "texture-atlas",
      code: `const assets = await new AssetGroupLoader().load(manifest, {
  onProgress: (event) => {
    console.log(event.loaded, event.total, event.name, event.status);
  }
});`
    },
    {
      title: "Collect Errors",
      body: "Set failFast false when the app should continue loading other assets and inspect missing items later.",
      liveDemoId: "texture-atlas",
      code: `const assets = await new AssetGroupLoader({
  failFast: false
}).load(manifest);

if (assets.hasError("player")) {
  console.error(assets.getError("player"));
}`
    },
    {
      title: "Unload Pack",
      body: "AssetGroup owns the loaded Texture objects. Dispose it when a level or document asset pack is removed.",
      liveDemoId: "texture-atlas",
      code: `assets.dispose();
loader.clearCache();
webglRenderer.clearTextureCache();`
    },
    {
      title: "Load Atlas JSON",
      body: "TextureAtlasLoader fetches JSON, loads the image beside the JSON file, then returns a TextureAtlas.",
      liveDemoId: "texture-atlas",
      code: `const atlas = await new TextureAtlasLoader({
  cache: true
}).load("/sprites/player.atlas.json");`
    },
    {
      title: "Clip From Names",
      body: "Build animation clips from atlas frame names instead of copying rectangles into every clip.",
      liveDemoId: "sprite-animation",
      code: `const idleClip = createSpriteAnimationClip({
  atlas,
  frameNames: ["idle1", "idle2", "idle3"],
  fps: 12,
  loop: true
});`
    }
  ]
};


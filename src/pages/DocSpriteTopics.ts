import type { DocTopic } from "./DocPage.type";
import { fullSpriteExample, fullTextureExample } from "./DocFullExamples";

export const spriteTopics: readonly DocTopic[] = [
  {
    id: "texture",
    label: "Texture",
    title: "Texture",
    description: "Texture wraps image-like source data for sprites, Canvas drawing, and WebGL upload.",
    sections: [
      {
        title: "Load Texture",
        body: "TextureLoader loads an image URL and returns a Texture promise.",
        liveDemoId: "sprite",
        code: `const texture = await new TextureLoader().load("/sprite.png");`
      },
      {
        title: "Texture Parameters",
        body: "Texture can also wrap an existing image-like browser source.",
        liveDemoId: "sprite",
        code: `source: CanvasImageSource
width?: number
height?: number`
      },
      {
        title: "Full Texture Code",
        body: "Complete texture loading example.",
        liveDemoId: "sprite",
        code: fullTextureExample
      }
    ]
  },
  {
    id: "texture-atlas",
    label: "TextureAtlas",
    title: "TextureAtlas",
    description: "TextureAtlas maps names to source rectangles inside one Texture. Sprites can draw only one frame from the shared texture.",
    sections: [
      {
        title: "Create Atlas",
        body: "Use TextureAtlas when many sprites share one image sheet. The atlas does not pack images yet; it stores explicit frame rectangles.",
        liveDemoId: "texture-atlas",
        code: `const atlas = new TextureAtlas({
  texture,
  frames: {
    idle: { x: 0, y: 0, width: 32, height: 32 },
    run: { x: 32, y: 0, width: 32, height: 32 }
  }
});`
      },
      {
        title: "Use Atlas Frame",
        body: "Pass the atlas texture and one named frame to Sprite. Canvas draws that source rectangle, and WebGL converts it to UVs.",
        liveDemoId: "texture-atlas",
        code: `const sprite = createSpriteFromAtlas({
  atlas,
  frame: "idle",
  x: 120,
  y: 80
});

scene.add(sprite);
raw2dCanvas.render(scene, camera);`
      },
      {
        title: "Create Many From Atlas",
        body: "Use createSpritesFromAtlas when a packed atlas should produce a keyed set of Sprite objects.",
        liveDemoId: "texture-atlas",
        code: `const sprites = createSpritesFromAtlas({
  atlas,
  sprites: {
    player: { frame: "idle", x: 80, y: 80 },
    enemy: { frame: "run", x: 140, y: 80 }
  }
});

scene.add(sprites.player);
scene.add(sprites.enemy);`
      },
      {
        title: "Why It Matters",
        body: "Atlas frames let many sprites share one Texture object. In WebGL this is the base for fewer texture binds and larger sprite batches.",
        liveDemoId: "texture-atlas",
        code: `// Same atlas.texture means these can stay in one texture batch
scene.add(new Sprite({ texture: atlas.texture, frame: atlas.getFrame("idle") }));
scene.add(new Sprite({ texture: atlas.texture, frame: atlas.getFrame("run") }));`
      },
      {
        title: "Pack Separate Sources",
        body: "TextureAtlasPacker creates one canvas texture from separate image-like sources. Use packWithStats when you also need atlas usage diagnostics.",
        liveDemoId: "texture-atlas",
        code: `const result = new TextureAtlasPacker({
  padding: 2,
  edgeBleed: 1,
  maxWidth: 1024,
  maxHeight: 1024,
  powerOfTwo: true,
  sort: "area"
}).packWithStats([
  { name: "idle", source: idleImage },
  { name: "run", source: runImage },
  { name: "jump", source: jumpImage }
]);

const atlas = result.atlas;
console.log(result.stats.occupancy);

scene.add(new Sprite({
  texture: atlas.texture,
  frame: atlas.getFrame("idle")
}));`
      },
      {
        title: "Packed Atlas In WebGL",
        body: "Packed sprites share atlas.texture, so consecutive frames can render in one texture batch. The stats should show one texture when only this atlas is used.",
        liveDemoId: "webgl-renderer",
        code: `scene.add(new Sprite({ texture: atlas.texture, frame: atlas.getFrame("idle") }));
scene.add(new Sprite({ texture: atlas.texture, frame: atlas.getFrame("run") }));

webglRenderer.render(scene, camera);
console.log(webglRenderer.getStats().textures);
// 1`
      },
      {
        title: "Packer Validation",
        body: "TextureAtlasPacker rejects duplicate frame names, invalid sizes, items larger than maxWidth/maxHeight, and rows that overflow maxHeight.",
        liveDemoId: "texture-atlas",
        code: `const atlas = new TextureAtlasPacker({
  padding: 2,
  edgeBleed: 1,
  maxWidth: 1024,
  maxHeight: 1024
}).pack(items);`
      }
    ]
  },
  {
    id: "sprite",
    label: "Sprite",
    title: "Sprite",
    description: "Sprite stores transform, size, opacity, and texture data. It does not draw itself.",
    sections: [
      {
        title: "Create Sprite",
        body: "Load a Texture, create a Sprite, add it to the Scene, then render with Canvas.",
        liveDemoId: "sprite",
        code: `const texture = await new TextureLoader().load("/sprite.png");

const sprite = new Sprite({
  x: 120,
  y: 80,
  texture,
  width: 128,
  height: 128,
  opacity: 1
});

scene.add(sprite);
raw2dCanvas.render(scene, camera);`
      },
      {
        title: "Sprite Parameters",
        body: "Fields accepted by Sprite.",
        liveDemoId: "sprite",
        code: `x: number
y: number
texture: Texture
width?: number
height?: number
opacity?: number
rotation?: number
scaleX?: number
scaleY?: number
origin?: Object2DOriginValue
visible?: boolean`
      },
      {
        title: "Full Sprite Code",
        body: "Complete setup from canvas element to rendered Sprite.",
        liveDemoId: "sprite",
        code: fullSpriteExample
      }
    ]
  },
  {
    id: "sprite-animation",
    label: "SpriteAnimation",
    title: "SpriteAnimation",
    description: "SpriteAnimationClip and SpriteAnimator provide low-level frame animation for atlas sprites.",
    sections: [
      {
        title: "Create Clip",
        body: "A clip stores ordered TextureAtlas frames plus timing. It does not start a loop by itself.",
        liveDemoId: "sprite-animation",
        code: `const clip = new SpriteAnimationClip({
  frames: [
    atlas.getFrame("idle1"),
    atlas.getFrame("idle2"),
    atlas.getFrame("idle3")
  ],
  fps: 12,
  loop: true
});`
      },
      {
        title: "Update Animator",
        body: "SpriteAnimator mutates only sprite.frame. Your app owns the clock and calls update(deltaSeconds).",
        liveDemoId: "sprite-animation",
        code: `const animator = new SpriteAnimator({ sprite, clip });

function animate(time: number): void {
  const deltaSeconds = getDelta(time);
  animator.update(deltaSeconds);
  raw2dCanvas.render(scene, camera);
  requestAnimationFrame(animate);
}`
      },
      {
        title: "Control Playback",
        body: "Playback is explicit. You can pause, play, stop, reset, or replace the current clip.",
        liveDemoId: "sprite-animation",
        code: `animator.pause();
animator.play();
animator.stop();
animator.setClip(runClip);`
      }
    ]
  }
];

import type { DocTopic } from "./DocPage.type";

export const texturePathTopics: readonly DocTopic[] = [
  {
    id: "texture-path",
    label: "Texture Path",
    title: "Texture Path",
    description: "A practical path for loading textures, using atlases, creating sprites, and animating frames.",
    sections: [
      {
        title: "Load Texture",
        body: "TextureLoader turns an image URL into a Texture object that Canvas and WebGL can use.",
        code: `const texture = await new TextureLoader().load("/sprite.png");`
      },
      {
        title: "Create Sprite",
        body: "Sprite stores texture, transform, size, frame, and opacity data. It does not draw itself.",
        code: `const sprite = new Sprite({
  x: 120,
  y: 80,
  texture,
  width: 128,
  height: 128,
  origin: "center"
});

scene.add(sprite);`
      },
      {
        title: "Create Atlas",
        body: "TextureAtlas maps frame names to source rectangles inside one shared texture.",
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
        body: "A Sprite can render one named frame while still sharing the atlas texture.",
        code: `const player = createSpriteFromAtlas({
  atlas,
  frame: "idle",
  x: 160,
  y: 120,
  origin: "center"
});`
      },
      {
        title: "Animate Frames",
        body: "SpriteAnimator mutates sprite.frame only when your app calls update with delta seconds.",
        code: `const clip = createSpriteAnimationClip({
  atlas,
  frames: ["idle", "run"],
  fps: 8,
  loop: true
});

const animator = new SpriteAnimator({ sprite: player, clip });
animator.update(deltaSeconds);`
      }
    ]
  }
];

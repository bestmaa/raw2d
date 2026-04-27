import type { DocTopic } from "./DocPage.type";
import { fullSpriteExample, fullTextureExample } from "./DocFullExamples";

export const spriteTopics: readonly DocTopic[] = [
  {
    id: "texture",
    label: "Texture",
    title: "Texture",
    description: "Texture wraps image-like source data for sprites and future WebGL upload.",
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
rawCanvas.render(scene, camera);`
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
  }
];

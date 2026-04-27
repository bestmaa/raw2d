import { Texture } from "./Texture.js";
import type { TextureLoaderLoadOptions, TextureLoaderOptions } from "./TextureLoader.type.js";

export class TextureLoader {
  private readonly crossOrigin?: "" | "anonymous" | "use-credentials";

  public constructor(options: TextureLoaderOptions = {}) {
    this.crossOrigin = options.crossOrigin;
  }

  public load(url: string, options: TextureLoaderLoadOptions = {}): Promise<Texture> {
    return new Promise((resolve, reject) => {
      const image = new Image();
      const crossOrigin = options.crossOrigin ?? this.crossOrigin;

      if (crossOrigin !== undefined) {
        image.crossOrigin = crossOrigin;
      }

      image.addEventListener("load", () => {
        resolve(new Texture({ source: image }));
      });
      image.addEventListener("error", () => {
        reject(new Error(`Failed to load texture: ${url}`));
      });
      image.src = url;
    });
  }
}

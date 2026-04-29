import { uid } from "raw2d-core";
import { getTextureSourceSize, normalizeTextureSize } from "./TextureSourceSize.js";
import type { TextureOptions, TextureSize, TextureSnapshot, TextureSource, TextureStatus } from "./Texture.type.js";

export class Texture {
  public readonly id: string;
  public readonly source: TextureSource;
  public readonly width: number;
  public readonly height: number;
  public readonly url: string | null;
  private status: TextureStatus = "ready";

  public constructor(options: TextureOptions) {
    const sourceSize = getTextureSourceSize(options.source);
    const size = normalizeTextureSize({
      width: options.width ?? sourceSize.width,
      height: options.height ?? sourceSize.height
    });

    this.id = options.id ?? uid("texture");
    this.source = options.source;
    this.width = size.width;
    this.height = size.height;
    this.url = options.url ?? null;
  }

  public getSize(): TextureSize {
    return {
      width: this.width,
      height: this.height
    };
  }

  public getStatus(): TextureStatus {
    return this.status;
  }

  public isDisposed(): boolean {
    return this.status === "disposed";
  }

  public getSnapshot(): TextureSnapshot {
    return {
      id: this.id,
      url: this.url,
      width: this.width,
      height: this.height,
      status: this.status
    };
  }

  public dispose(): void {
    if (this.status === "disposed") {
      return;
    }

    closeSource(this.source);
    this.status = "disposed";
  }
}

interface CloseableSource {
  close(): void;
}

function closeSource(source: TextureSource): void {
  if ("close" in source && typeof source.close === "function") {
    (source as TextureSource & CloseableSource).close();
  }
}

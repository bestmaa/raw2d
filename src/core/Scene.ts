import { uid } from "../utils";
import type { CanvasObject } from "./Canvas.type";
import type { SceneLike, SceneOptions } from "./Scene.type";

export class Scene implements SceneLike {
  public readonly id: string;
  public name: string;
  private readonly objects: CanvasObject[] = [];

  public constructor(options: SceneOptions = {}) {
    this.id = uid("scene");
    this.name = options.name ?? "";

    for (const object of options.objects ?? []) {
      this.add(object);
    }
  }

  public add(object: CanvasObject): this {
    if (!this.objects.includes(object)) {
      this.objects.push(object);
    }

    return this;
  }

  public remove(object: CanvasObject): this {
    const index = this.objects.indexOf(object);

    if (index !== -1) {
      this.objects.splice(index, 1);
    }

    return this;
  }

  public clear(): void {
    this.objects.length = 0;
  }

  public getObjects(): readonly CanvasObject[] {
    return this.objects;
  }
}

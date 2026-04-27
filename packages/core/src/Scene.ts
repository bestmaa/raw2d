import { uid } from "./uid.js";
import type { SceneObject } from "./Scene.type.js";
import type { SceneLike, SceneOptions } from "./Scene.type.js";

export class Scene implements SceneLike {
  public readonly id: string;
  public name: string;
  private readonly objects: SceneObject[] = [];

  public constructor(options: SceneOptions = {}) {
    this.id = uid("scene");
    this.name = options.name ?? "";

    for (const object of options.objects ?? []) {
      this.add(object);
    }
  }

  public add(object: SceneObject): this {
    if (!this.objects.includes(object)) {
      this.objects.push(object);
    }

    return this;
  }

  public remove(object: SceneObject): this {
    const index = this.objects.indexOf(object);

    if (index !== -1) {
      this.objects.splice(index, 1);
    }

    return this;
  }

  public clear(): void {
    this.objects.length = 0;
  }

  public getObjects(): readonly SceneObject[] {
    return this.objects;
  }
}

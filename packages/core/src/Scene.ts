import { uid } from "./uid.js";
import { attachObject2D, detachObject2D } from "./Object2DLifecycle.js";
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
      attachObject2D({ object, parent: this });
    }

    return this;
  }

  public remove(object: SceneObject): this {
    const index = this.objects.indexOf(object);

    if (index !== -1) {
      this.objects.splice(index, 1);
      detachObject2D({ object, parent: this });
    }

    return this;
  }

  public clear(): void {
    for (const object of this.objects) {
      detachObject2D({ object, parent: this });
    }

    this.objects.length = 0;
  }

  public getObjects(): readonly SceneObject[] {
    return this.objects;
  }
}

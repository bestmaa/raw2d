import type { Object2D } from "raw2d-core";
import type { SelectionManagerOptions, SelectionSnapshot, SelectObjectOptions } from "./SelectionManager.type.js";

export class SelectionManager {
  private readonly selectedObjects: Object2D[] = [];

  public constructor(options: SelectionManagerOptions = {}) {
    this.selectMany(options.objects ?? []);
  }

  public select(object: Object2D, options: SelectObjectOptions = {}): void {
    if (options.toggle) {
      this.toggle(object);
      return;
    }

    if (!options.append) {
      this.clear();
    }

    this.add(object);
  }

  public selectMany(objects: readonly Object2D[]): void {
    this.clear();

    for (const object of objects) {
      this.add(object);
    }
  }

  public add(object: Object2D): void {
    if (!this.isSelected(object)) {
      this.selectedObjects.push(object);
    }
  }

  public remove(object: Object2D): void {
    const index = this.selectedObjects.indexOf(object);

    if (index !== -1) {
      this.selectedObjects.splice(index, 1);
    }
  }

  public toggle(object: Object2D): void {
    if (this.isSelected(object)) {
      this.remove(object);
      return;
    }

    this.add(object);
  }

  public clear(): void {
    this.selectedObjects.length = 0;
  }

  public isSelected(object: Object2D): boolean {
    return this.selectedObjects.includes(object);
  }

  public getSelected(): readonly Object2D[] {
    return this.selectedObjects;
  }

  public getPrimary(): Object2D | null {
    return this.selectedObjects.at(-1) ?? null;
  }

  public getSnapshot(): SelectionSnapshot {
    return {
      objects: [...this.selectedObjects],
      primary: this.getPrimary()
    };
  }
}

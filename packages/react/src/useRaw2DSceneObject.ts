import { useContext, useEffect } from "react";
import { Raw2DReactContext } from "./Raw2DReactContext.js";
import type { UseRaw2DSceneObjectOptions } from "./useRaw2DSceneObject.type.js";
import type { Object2D } from "raw2d";

export function useRaw2DSceneObject<TObject extends Object2D>(options: UseRaw2DSceneObjectOptions<TObject>): void {
  const context = useContext(Raw2DReactContext);

  useEffect((): (() => void) | undefined => {
    if (!context) {
      return undefined;
    }

    context.scene.add(options.object);
    context.requestRender();

    return (): void => {
      context.scene.remove(options.object);
      context.requestRender();
    };
  }, [context, options.object]);

  useEffect((): void => {
    options.update();
    context?.requestRender();
  }, [context, options.object, ...options.dependencies]);
}

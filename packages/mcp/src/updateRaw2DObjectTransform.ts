import type { Raw2DMcpSceneObjectJson } from "./Raw2DSceneObjectJson.type.js";
import type { Raw2DMcpSceneDocument } from "./Raw2DSceneJson.type.js";
import type { UpdateRaw2DObjectTransformOptions } from "./updateRaw2DObjectTransform.type.js";

export function updateRaw2DObjectTransform(options: UpdateRaw2DObjectTransformOptions): Raw2DMcpSceneDocument {
  let updated = false;
  const objects = options.document.scene.objects.map((object) => {
    if (object.id !== options.id) {
      return object;
    }

    updated = true;
    return {
      ...object,
      ...options.transform
    } satisfies Raw2DMcpSceneObjectJson;
  });

  if (!updated) {
    throw new Error(`Raw2D MCP scene does not contain object id "${options.id}".`);
  }

  return {
    scene: { objects },
    camera: options.document.camera
  };
}

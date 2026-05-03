import type { Raw2DMcpSceneObjectJson } from "./Raw2DSceneObjectJson.type.js";
import type { Raw2DMcpSceneDocument } from "./Raw2DSceneJson.type.js";
import type { UpdateRaw2DObjectMaterialOptions } from "./updateRaw2DObjectMaterial.type.js";

export function updateRaw2DObjectMaterial(options: UpdateRaw2DObjectMaterialOptions): Raw2DMcpSceneDocument {
  let updated = false;
  const objects = options.document.scene.objects.map((object) => {
    if (object.id !== options.id) {
      return object;
    }

    updated = true;
    return {
      ...object,
      material: {
        ...object.material,
        ...options.material
      }
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

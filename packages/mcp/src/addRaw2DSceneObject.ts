import type { Raw2DMcpSceneDocument } from "./Raw2DSceneJson.type.js";
import type { Raw2DMcpSceneObjectJson } from "./Raw2DSceneObjectJson.type.js";

export interface AddRaw2DSceneObjectOptions {
  readonly document: Raw2DMcpSceneDocument;
  readonly object: Raw2DMcpSceneObjectJson;
}

export function addRaw2DSceneObject(options: AddRaw2DSceneObjectOptions): Raw2DMcpSceneDocument {
  assertUniqueId(options.document, options.object.id);

  return {
    scene: {
      objects: [...options.document.scene.objects, options.object]
    },
    camera: options.document.camera
  };
}

function assertUniqueId(document: Raw2DMcpSceneDocument, id: string): void {
  if (document.scene.objects.some((object) => object.id === id)) {
    throw new Error(`Raw2D MCP scene already contains object id "${id}".`);
  }
}

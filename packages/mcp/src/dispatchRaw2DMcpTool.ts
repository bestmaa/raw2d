import { addRaw2DSceneObject } from "./addRaw2DSceneObject.js";
import type { AddRaw2DSceneObjectOptions } from "./addRaw2DSceneObject.js";
import { createRaw2DMcpManifest } from "./createRaw2DMcpManifest.js";
import { createRaw2DSceneJson } from "./createRaw2DSceneJson.js";
import type { CreateRaw2DSceneJsonOptions } from "./Raw2DSceneJson.type.js";
import { createRaw2DVisualCheckPlan } from "./createRaw2DVisualCheckPlan.js";
import type { CreateRaw2DVisualCheckPlanOptions } from "./createRaw2DVisualCheckPlan.type.js";
import { generateRaw2DCanvasExample } from "./generateRaw2DCanvasExample.js";
import { generateRaw2DDocsSnippet } from "./generateRaw2DDocsSnippet.js";
import type { GenerateRaw2DDocsSnippetOptions } from "./generateRaw2DDocsSnippet.type.js";
import { generateRaw2DWebGLExample } from "./generateRaw2DWebGLExample.js";
import type { GenerateRaw2DExampleOptions } from "./generateRaw2DExample.type.js";
import { inspectRaw2DScene } from "./inspectRaw2DScene.js";
import type { InspectRaw2DSceneOptions } from "./inspectRaw2DScene.type.js";
import { updateRaw2DObjectMaterial } from "./updateRaw2DObjectMaterial.js";
import type { UpdateRaw2DObjectMaterialOptions } from "./updateRaw2DObjectMaterial.type.js";
import { updateRaw2DObjectTransform } from "./updateRaw2DObjectTransform.js";
import type { UpdateRaw2DObjectTransformOptions } from "./updateRaw2DObjectTransform.type.js";
import { validateRaw2DScene } from "./validateRaw2DScene.js";
import type { ValidateRaw2DSceneOptions } from "./validateRaw2DScene.type.js";

type ToolHandler = (params: unknown) => unknown;

const handlers: Readonly<Record<string, ToolHandler>> = {
  raw2d_add_object: (params) => addRaw2DSceneObject(requireRecord<AddRaw2DSceneObjectOptions>(params)),
  raw2d_create_scene: (params) => createRaw2DSceneJson(optionalRecord<CreateRaw2DSceneJsonOptions>(params)),
  raw2d_generate_canvas_example: (params) => generateRaw2DCanvasExample(requireRecord<GenerateRaw2DExampleOptions>(params)),
  raw2d_generate_docs_snippet: (params) => generateRaw2DDocsSnippet(requireRecord<GenerateRaw2DDocsSnippetOptions>(params)),
  raw2d_generate_webgl_example: (params) => generateRaw2DWebGLExample(requireRecord<GenerateRaw2DExampleOptions>(params)),
  raw2d_inspect_scene: (params) => inspectRaw2DScene(requireRecord<InspectRaw2DSceneOptions>(params)),
  raw2d_manifest: () => createRaw2DMcpManifest(),
  raw2d_run_visual_check: (params) => createRaw2DVisualCheckPlan(optionalRecord<CreateRaw2DVisualCheckPlanOptions>(params)),
  raw2d_update_material: (params) => updateRaw2DObjectMaterial(requireRecord<UpdateRaw2DObjectMaterialOptions>(params)),
  raw2d_update_transform: (params) => updateRaw2DObjectTransform(requireRecord<UpdateRaw2DObjectTransformOptions>(params)),
  raw2d_validate_scene: (params) => validateRaw2DScene(requireRecord<ValidateRaw2DSceneOptions>(params))
};

export function dispatchRaw2DMcpTool(method: string, params?: unknown): unknown {
  const handler = handlers[method];

  if (!handler) {
    throw new Error(`Unknown Raw2D MCP method: ${method}`);
  }

  return handler(params);
}

function optionalRecord<T extends object>(value: unknown): T | undefined {
  if (value === undefined || value === null) {
    return undefined;
  }

  return requireRecord<T>(value);
}

function requireRecord<T extends object>(value: unknown): T {
  if (!isRecord(value)) {
    throw new Error("MCP params must be an object.");
  }

  return value as T;
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

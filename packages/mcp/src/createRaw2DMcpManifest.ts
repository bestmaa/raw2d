import type { Raw2DMcpManifest, Raw2DMcpToolDefinition } from "./Raw2DMcpManifest.type.js";

const tools: readonly Raw2DMcpToolDefinition[] = [
  { name: "raw2d_create_scene", description: "Create an empty Raw2D scene JSON document.", mutatesScene: false },
  { name: "raw2d_add_object", description: "Add a supported object to a scene JSON document.", mutatesScene: true },
  { name: "raw2d_update_transform", description: "Update object transform fields.", mutatesScene: true },
  { name: "raw2d_update_material", description: "Update object material fields.", mutatesScene: true },
  { name: "raw2d_inspect_scene", description: "Summarize scene counts and renderer hints.", mutatesScene: false },
  { name: "raw2d_validate_scene", description: "Validate scene JSON without mutating it.", mutatesScene: false },
  { name: "raw2d_generate_canvas_example", description: "Generate Canvas example code.", mutatesScene: false },
  { name: "raw2d_generate_webgl_example", description: "Generate WebGL example code.", mutatesScene: false },
  { name: "raw2d_generate_docs_snippet", description: "Generate a docs snippet from scene JSON.", mutatesScene: false },
  { name: "raw2d_run_visual_check", description: "Describe the future visual check command boundary.", mutatesScene: false }
];

export function createRaw2DMcpManifest(version = "0.7.9"): Raw2DMcpManifest {
  return {
    name: "raw2d-mcp",
    version,
    tools
  };
}

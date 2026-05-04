import type { DocTopic } from "./DocPage.type";

export const mcpTopics: readonly DocTopic[] = [
  {
    id: "mcp",
    label: "MCP",
    title: "Raw2D MCP",
    description: "Use raw2d-mcp to create, validate, inspect, and document Raw2D scene JSON from automation tools.",
    sections: [
      {
        title: "Install",
        body: "Install the MCP package next to Raw2D when an agent or build script needs scene automation helpers.",
        code: `npm install raw2d-mcp raw2d`
      },
      {
        title: "Create Scene JSON",
        body: "The scene JSON shape stays close to Raw2D public object options so generated code is easy to inspect.",
        code: `import { addRaw2DSceneObject, createRaw2DSceneJson } from "raw2d-mcp";

const document = addRaw2DSceneObject({
  document: createRaw2DSceneJson({ camera: { x: 0, y: 0, zoom: 1 } }),
  object: {
    type: "rect",
    id: "hero-card",
    x: 80,
    y: 64,
    width: 160,
    height: 96,
    material: { fillColor: "#35c2ff" }
  }
});`
      },
      {
        title: "Validate And Inspect",
        body: "Validation returns path-based errors for unknown JSON. Inspection returns counts and renderer hints.",
        code: `import { inspectRaw2DScene, validateRaw2DScene } from "raw2d-mcp";

const validation = validateRaw2DScene({ document });

if (!validation.valid) {
  console.table(validation.errors);
}

const inspection = inspectRaw2DScene({ document });

console.log(inspection.objectCount);
console.log(inspection.rendererHints);`
      },
      {
        title: "Tool Schemas",
        body: "Every MCP tool uses explicit params and JSON output. Scene tools return scene documents, validation returns errors, generators return code or markdown, and visual checks return command plans.",
        code: `raw2d_create_scene -> SceneDocument
raw2d_add_object -> SceneDocument
raw2d_update_transform -> SceneDocument
raw2d_update_material -> SceneDocument
raw2d_inspect_scene -> inspection JSON
raw2d_validate_scene -> { valid, errors }
raw2d_generate_canvas_example -> { code, renderer }
raw2d_generate_webgl_example -> { code, renderer }
raw2d_generate_docs_snippet -> { markdown }
raw2d_run_visual_check -> { commands }`
      },
      {
        title: "Generate Examples",
        body: "Generate Canvas, WebGL, or markdown snippets. The output is plain text so agents can show it before writing files.",
        code: `import {
  generateRaw2DCanvasExample,
  generateRaw2DDocsSnippet,
  generateRaw2DWebGLExample
} from "raw2d-mcp";

const canvasExample = generateRaw2DCanvasExample({ document });
const webglExample = generateRaw2DWebGLExample({ document });
const docsSnippet = generateRaw2DDocsSnippet({ document, title: "Hero Card Scene" });

console.log(canvasExample.code);
console.log(webglExample.code);
console.log(docsSnippet.markdown);`
      },
      {
        title: "Tool Boundary",
        body: "raw2d-mcp returns data, code, audits, and command plans. It does not silently edit projects, publish packages, push Git, or control a browser.",
        code: `import { createRaw2DVisualCheckPlan } from "raw2d-mcp";

const plan = createRaw2DVisualCheckPlan({ target: "all" });

for (const command of plan.commands) {
  console.log(command.command, command.args.join(" "));
}`
      },
      {
        title: "AI Control Rule",
        body: "Agents should validate and show generated output before any host environment writes files, runs visual checks, publishes packages, or pushes Git.",
        code: `Allowed inside raw2d-mcp:
- return JSON
- return generated code
- return command plans

Not allowed inside raw2d-mcp:
- hidden file writes
- npm publish
- git push
- internal browser control`
      },
      {
        title: "Server Entry Design",
        body: "The future raw2d-mcp executable should be a Node.js stdio server that dispatches to pure helper functions. It must not import Canvas, WebGL, DOM, or browser runtime packages.",
        code: `// Future package shape:
{
  "bin": {
    "raw2d-mcp": "./dist/server.js"
  }
}

// Runtime rule:
// raw2d-mcp -> raw2d-core + stdio adapter
// raw2d-mcp -> no raw2d-canvas/raw2d-webgl imports`
      }
    ]
  }
];

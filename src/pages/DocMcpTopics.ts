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
      }
    ]
  }
];

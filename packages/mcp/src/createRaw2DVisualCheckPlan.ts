import type {
  CreateRaw2DVisualCheckPlanOptions,
  Raw2DMcpVisualCheckCommand,
  Raw2DMcpVisualCheckPlan,
  Raw2DMcpVisualCheckTarget
} from "./createRaw2DVisualCheckPlan.type.js";

const webglGeometryCommand: Raw2DMcpVisualCheckCommand = {
  command: "node",
  args: ["--test", "tests/webgl/visual-regression.test.mjs"],
  description: "Verify stable WebGL geometry and sprite/text visual snapshots."
};

const browserSmokeCommand: Raw2DMcpVisualCheckCommand = {
  command: "npm",
  args: ["run", "test:browser"],
  description: "Verify docs and example routes load through Vite."
};

export function createRaw2DVisualCheckPlan(options: CreateRaw2DVisualCheckPlanOptions = {}): Raw2DMcpVisualCheckPlan {
  const target = options.target ?? "all";

  return {
    target,
    commands: getCommands(target),
    manualBrowserRequired: target !== "webgl-geometry"
  };
}

function getCommands(target: Raw2DMcpVisualCheckTarget): readonly Raw2DMcpVisualCheckCommand[] {
  if (target === "webgl-geometry") {
    return [webglGeometryCommand];
  }

  if (target === "browser-smoke") {
    return [browserSmokeCommand];
  }

  return [webglGeometryCommand, browserSmokeCommand];
}

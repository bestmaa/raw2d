export type Raw2DMcpVisualCheckTarget = "webgl-geometry" | "browser-smoke" | "all";

export interface CreateRaw2DVisualCheckPlanOptions {
  readonly target?: Raw2DMcpVisualCheckTarget;
}

export interface Raw2DMcpVisualCheckCommand {
  readonly command: string;
  readonly args: readonly string[];
  readonly description: string;
}

export interface Raw2DMcpVisualCheckPlan {
  readonly target: Raw2DMcpVisualCheckTarget;
  readonly commands: readonly Raw2DMcpVisualCheckCommand[];
  readonly manualBrowserRequired: boolean;
}

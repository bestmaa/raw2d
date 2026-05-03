export interface Raw2DMcpToolDefinition {
  readonly name: string;
  readonly description: string;
  readonly mutatesScene: boolean;
}

export interface Raw2DMcpManifest {
  readonly name: "raw2d-mcp";
  readonly version: string;
  readonly tools: readonly Raw2DMcpToolDefinition[];
}

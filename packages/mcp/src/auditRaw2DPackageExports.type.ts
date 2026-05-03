export interface Raw2DMcpPackageManifestJson {
  readonly name: string;
  readonly types?: string;
  readonly module?: string;
  readonly main?: string;
  readonly exports?: {
    readonly "."?: {
      readonly types?: string;
      readonly import?: string;
      readonly require?: string;
    };
  };
}

export interface AuditRaw2DPackageExportsOptions {
  readonly packages: readonly Raw2DMcpPackageManifestJson[];
}

export interface Raw2DMcpExportAuditIssue {
  readonly packageName: string;
  readonly path: string;
  readonly message: string;
}

export interface Raw2DMcpExportAuditResult {
  readonly valid: boolean;
  readonly checkedPackages: number;
  readonly issues: readonly Raw2DMcpExportAuditIssue[];
}

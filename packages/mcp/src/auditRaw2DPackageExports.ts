import type {
  AuditRaw2DPackageExportsOptions,
  Raw2DMcpExportAuditIssue,
  Raw2DMcpExportAuditResult,
  Raw2DMcpPackageManifestJson
} from "./auditRaw2DPackageExports.type.js";

const expectedTypes = "./dist/index.d.ts";
const expectedEsm = "./dist/index.js";

export function auditRaw2DPackageExports(options: AuditRaw2DPackageExportsOptions): Raw2DMcpExportAuditResult {
  const issues = options.packages.flatMap(auditPackage);

  return {
    valid: issues.length === 0,
    checkedPackages: options.packages.length,
    issues
  };
}

function auditPackage(manifest: Raw2DMcpPackageManifestJson): readonly Raw2DMcpExportAuditIssue[] {
  const issues: Raw2DMcpExportAuditIssue[] = [];
  const rootExport = manifest.exports?.["."];

  if (!rootExport) {
    issues.push(createIssue(manifest.name, "exports['.']", "Package must expose one root export."));
    return issues;
  }

  if (manifest.types !== expectedTypes || rootExport.types !== expectedTypes) {
    issues.push(createIssue(manifest.name, "types", `Types must point to ${expectedTypes}.`));
  }

  if (manifest.name === "raw2d") {
    auditUmbrellaPackage(manifest, rootExport, issues);
  } else {
    auditFocusedPackage(manifest, rootExport, issues);
  }

  return issues;
}

function auditFocusedPackage(
  manifest: Raw2DMcpPackageManifestJson,
  rootExport: NonNullable<Raw2DMcpPackageManifestJson["exports"]>["."],
  issues: Raw2DMcpExportAuditIssue[]
): void {
  if (manifest.module !== expectedEsm || manifest.main !== expectedEsm || rootExport?.import !== expectedEsm) {
    issues.push(createIssue(manifest.name, "module", `Focused packages must use ${expectedEsm}.`));
  }

  if (rootExport?.require !== undefined) {
    issues.push(createIssue(manifest.name, "exports['.'].require", "Focused packages must not expose CommonJS require."));
  }
}

function auditUmbrellaPackage(
  manifest: Raw2DMcpPackageManifestJson,
  rootExport: NonNullable<Raw2DMcpPackageManifestJson["exports"]>["."],
  issues: Raw2DMcpExportAuditIssue[]
): void {
  if (manifest.module !== "./dist/raw2d.js" || rootExport?.import !== "./dist/raw2d.js") {
    issues.push(createIssue(manifest.name, "module", "Umbrella package must expose the ESM bundle."));
  }

  if (manifest.main !== "./dist/raw2d.umd.cjs" || rootExport?.require !== "./dist/raw2d.umd.cjs") {
    issues.push(createIssue(manifest.name, "main", "Umbrella package must expose the UMD bundle."));
  }
}

function createIssue(packageName: string, path: string, message: string): Raw2DMcpExportAuditIssue {
  return { packageName, path, message };
}

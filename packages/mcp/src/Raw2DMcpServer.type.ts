export type Raw2DMcpRequestId = string | number | null;

export interface Raw2DMcpServerRequest {
  readonly id?: Raw2DMcpRequestId;
  readonly method: string;
  readonly params?: unknown;
}

export interface Raw2DMcpServerError {
  readonly code: number;
  readonly message: string;
}

export interface Raw2DMcpServerSuccessResponse {
  readonly jsonrpc: "2.0";
  readonly id: Raw2DMcpRequestId;
  readonly result: unknown;
}

export interface Raw2DMcpServerErrorResponse {
  readonly jsonrpc: "2.0";
  readonly id: Raw2DMcpRequestId;
  readonly error: Raw2DMcpServerError;
}

export type Raw2DMcpServerResponse = Raw2DMcpServerSuccessResponse | Raw2DMcpServerErrorResponse;

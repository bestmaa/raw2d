#!/usr/bin/env node
import { dispatchRaw2DMcpTool } from "./dispatchRaw2DMcpTool.js";
import type { Raw2DMcpRequestId, Raw2DMcpServerRequest, Raw2DMcpServerResponse } from "./Raw2DMcpServer.type.js";

declare const process: {
  readonly stdin: {
    setEncoding(encoding: string): void;
    on(event: "data", listener: (chunk: string) => void): void;
    on(event: "end", listener: () => void): void;
  };
  readonly stdout: {
    write(chunk: string): void;
  };
  readonly stderr: {
    write(chunk: string): void;
  };
};

let buffer = "";

process.stdin.setEncoding("utf8");
process.stdin.on("data", (chunk) => {
  buffer += chunk;
  flushLines();
});
process.stdin.on("end", () => {
  if (buffer.trim().length > 0) {
    writeResponse(createRaw2DMcpServerResponse(buffer));
  }
});

export function createRaw2DMcpServerResponse(input: string): Raw2DMcpServerResponse {
  try {
    const request = parseRequest(input);
    return {
      jsonrpc: "2.0",
      id: request.id ?? null,
      result: dispatchRaw2DMcpTool(request.method, request.params)
    };
  } catch (error) {
    return {
      jsonrpc: "2.0",
      id: extractRequestId(input),
      error: {
        code: -32_000,
        message: error instanceof Error ? error.message : "Unknown MCP server error."
      }
    };
  }
}

function flushLines(): void {
  let newlineIndex = buffer.indexOf("\n");

  while (newlineIndex >= 0) {
    const line = buffer.slice(0, newlineIndex).trim();
    buffer = buffer.slice(newlineIndex + 1);

    if (line.length > 0) {
      writeResponse(createRaw2DMcpServerResponse(line));
    }

    newlineIndex = buffer.indexOf("\n");
  }
}

function parseRequest(input: string): Raw2DMcpServerRequest {
  const value: unknown = JSON.parse(input);

  if (!isRecord(value) || typeof value.method !== "string") {
    throw new Error("MCP request must include a string method.");
  }

  return {
    id: parseRequestId(value.id),
    method: value.method,
    params: value.params
  };
}

function extractRequestId(input: string): Raw2DMcpRequestId {
  try {
    const value: unknown = JSON.parse(input);
    return isRecord(value) ? parseRequestId(value.id) : null;
  } catch {
    return null;
  }
}

function parseRequestId(value: unknown): Raw2DMcpRequestId {
  return typeof value === "string" || typeof value === "number" || value === null ? value : null;
}

function writeResponse(response: Raw2DMcpServerResponse): void {
  process.stdout.write(`${JSON.stringify(response)}\n`);
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

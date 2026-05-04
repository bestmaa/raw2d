import { readFileSync } from "node:fs";
import assert from "node:assert/strict";
import { spawn } from "node:child_process";
import test from "node:test";

test("raw2d-mcp package exposes a stdio bin entry", () => {
  const manifest = JSON.parse(readFileSync("packages/mcp/package.json", "utf8"));

  assert.equal(manifest.bin["raw2d-mcp"], "./dist/server.js");
  assert.deepEqual(Object.keys(manifest.exports), ["."]);
});

test("raw2d-mcp stdio server responds to a create scene request", async () => {
  const server = spawn(process.execPath, ["packages/mcp/dist/server.js"], {
    stdio: ["pipe", "pipe", "pipe"]
  });

  const output = waitForLine(server.stdout);
  server.stdin.write(`${JSON.stringify({ jsonrpc: "2.0", id: 1, method: "raw2d_create_scene", params: {} })}\n`);

  const line = await output;
  server.kill("SIGTERM");

  const response = JSON.parse(line);

  assert.equal(response.jsonrpc, "2.0");
  assert.equal(response.id, 1);
  assert.deepEqual(response.result.scene.objects, []);
  assert.equal(response.result.camera.zoom, 1);
});

test("raw2d-mcp stdio server returns structured method errors", async () => {
  const server = spawn(process.execPath, ["packages/mcp/dist/server.js"], {
    stdio: ["pipe", "pipe", "pipe"]
  });

  const output = waitForLine(server.stdout);
  server.stdin.write(`${JSON.stringify({ jsonrpc: "2.0", id: "bad", method: "raw2d_missing_tool" })}\n`);

  const line = await output;
  server.kill("SIGTERM");

  const response = JSON.parse(line);

  assert.equal(response.id, "bad");
  assert.equal(response.error.code, -32_000);
  assert.match(response.error.message, /Unknown Raw2D MCP method/);
});

function waitForLine(stream) {
  return new Promise((resolve, reject) => {
    const timeout = setTimeout(() => {
      reject(new Error("Timed out waiting for MCP server response."));
    }, 2_000);

    stream.once("data", (chunk) => {
      clearTimeout(timeout);
      resolve(chunk.toString().trim());
    });
  });
}

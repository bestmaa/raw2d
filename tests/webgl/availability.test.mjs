import assert from "node:assert/strict";
import test from "node:test";
import { isWebGL2Available } from "raw2d-webgl";

test("isWebGL2Available returns false without WebGL2RenderingContext", () => {
  const restore = installWebGL2(undefined);
  const canvas = createCanvas({});

  assert.equal(isWebGL2Available({ canvas }), false);
  restore();
});

test("isWebGL2Available checks explicit canvas context", () => {
  const restore = installWebGL2(function WebGL2RenderingContext() {});
  const canvas = createCanvas({ webgl2: {} });

  assert.equal(isWebGL2Available({ canvas }), true);
  restore();
});

test("isWebGL2Available returns false when context creation throws", () => {
  const restore = installWebGL2(function WebGL2RenderingContext() {});

  assert.equal(isWebGL2Available({ canvas: createThrowingCanvas() }), false);
  restore();
});

function installWebGL2(value) {
  const existing = globalThis.WebGL2RenderingContext;

  if (value === undefined) {
    Reflect.deleteProperty(globalThis, "WebGL2RenderingContext");
  } else {
    Object.defineProperty(globalThis, "WebGL2RenderingContext", {
      configurable: true,
      value
    });
  }

  return () => {
    if (existing === undefined) {
      Reflect.deleteProperty(globalThis, "WebGL2RenderingContext");
      return;
    }

    Object.defineProperty(globalThis, "WebGL2RenderingContext", {
      configurable: true,
      value: existing
    });
  };
}

function createCanvas(contexts) {
  return {
    getContext(type) {
      return contexts[type] ?? null;
    }
  };
}

function createThrowingCanvas() {
  return {
    getContext() {
      throw new Error("blocked");
    }
  };
}

import assert from "node:assert/strict";
import test from "node:test";
import {
  createBlurEffect,
  createGrayscaleEffect,
  createOpacityEffect,
  createShadowEffect,
  isRaw2DEffect,
  validateRaw2DEffect,
  validateRaw2DEffects
} from "raw2d-effects";

test("raw2d-effects creates renderer-neutral descriptors", () => {
  assert.deepEqual(createOpacityEffect(0.5, "fade"), { type: "opacity", opacity: 0.5, id: "fade" });
  assert.deepEqual(createBlurEffect(8), { type: "blur", radius: 8 });
  assert.deepEqual(createGrayscaleEffect(1), { type: "grayscale", amount: 1 });
  assert.deepEqual(createShadowEffect({ color: "#000000", blur: 4, offsetX: 2, offsetY: 3 }), {
    type: "shadow",
    color: "#000000",
    blur: 4,
    offsetX: 2,
    offsetY: 3
  });
});

test("raw2d-effects validates effect descriptors", () => {
  assert.equal(validateRaw2DEffect(createOpacityEffect(1)).valid, true);
  assert.equal(isRaw2DEffect(createShadowEffect({ color: "#111111" })), true);

  const result = validateRaw2DEffects([
    { type: "opacity", opacity: 1.2 },
    { type: "blur", radius: -1 },
    { type: "shadow", color: "", blur: 1, offsetX: 0, offsetY: 0 }
  ]);

  assert.equal(result.valid, false);
  assert.deepEqual(result.issues.map((issue) => issue.path), ["$[0].opacity", "$[1].radius", "$[2].color"]);
});

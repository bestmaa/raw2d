import assert from "node:assert/strict";
import test from "node:test";
import {
  RAW2D_FIBER_HOST_BOUNDARY,
  RAW2D_REACT_FIBER_PACKAGE_INFO,
  getRaw2DFiberHostBoundary
} from "raw2d-react-fiber";

test("raw2d-react-fiber exposes the host config boundary", () => {
  assert.equal(RAW2D_REACT_FIBER_PACKAGE_INFO.packageName, "raw2d-react-fiber");
  assert.equal(RAW2D_REACT_FIBER_PACKAGE_INFO.status, "host-config");
  assert.equal(RAW2D_REACT_FIBER_PACKAGE_INFO.changesCoreApi, false);

  assert.equal(RAW2D_FIBER_HOST_BOUNDARY.packageName, "raw2d-react-fiber");
  assert.equal(RAW2D_FIBER_HOST_BOUNDARY.ownsRenderer, false);
  assert.deepEqual(RAW2D_FIBER_HOST_BOUNDARY.supportedObjects, [
    "Rect",
    "Circle",
    "Line",
    "Text2D",
    "Sprite",
    "Group2D"
  ]);
  assert.deepEqual(getRaw2DFiberHostBoundary(), RAW2D_FIBER_HOST_BOUNDARY);
});

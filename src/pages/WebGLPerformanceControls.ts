import type { WebGLPerformanceState, WebGLPerformanceTextureMode } from "./WebGLPerformanceDemo.type";

export function createWebGLPerformanceControls(
  state: WebGLPerformanceState,
  onChange: () => void,
  onToggle: () => void
): HTMLElement {
  const controls = document.createElement("div");
  const runButton = document.createElement("button");
  controls.className = "shape-demo-controls";
  runButton.type = "button";
  runButton.className = "shape-demo-action";
  runButton.textContent = "Pause loop";
  runButton.addEventListener("click", () => {
    state.running = !state.running;
    runButton.textContent = state.running ? "Pause loop" : "Play loop";
    onToggle();
  });
  controls.append(
    runButton,
    createRangeControl(state, onChange),
    createModeControl(state, onChange),
    createToggleControl("Culling", state.culling, (checked) => {
      state.culling = checked;
      onChange();
    }),
    createToggleControl("Static cache", state.staticMode, (checked) => {
      state.staticMode = checked;
      onChange();
    })
  );
  return controls;
}

function createRangeControl(state: WebGLPerformanceState, onChange: () => void): HTMLElement {
  const wrapper = document.createElement("label");
  const text = document.createElement("span");
  const input = document.createElement("input");
  wrapper.className = "shape-demo-control";
  text.textContent = `Objects: ${state.objectCount}`;
  input.type = "range";
  input.min = "100";
  input.max = "1000";
  input.step = "20";
  input.value = String(state.objectCount);
  input.addEventListener("input", () => {
    state.objectCount = Number(input.value);
    text.textContent = `Objects: ${state.objectCount}`;
    onChange();
  });
  wrapper.append(text, input);
  return wrapper;
}

function createModeControl(state: WebGLPerformanceState, onChange: () => void): HTMLElement {
  const wrapper = document.createElement("label");
  const text = document.createElement("span");
  const select = document.createElement("select");
  wrapper.className = "shape-demo-control";
  text.textContent = "Textures";
  select.append(createOption("packed", "Packed atlas"), createOption("separate", "Separate"));
  select.value = state.textureMode;
  select.addEventListener("change", () => {
    state.textureMode = select.value as WebGLPerformanceTextureMode;
    onChange();
  });
  wrapper.append(text, select);
  return wrapper;
}

function createToggleControl(label: string, checked: boolean, onChange: (checked: boolean) => void): HTMLElement {
  const wrapper = document.createElement("label");
  const input = document.createElement("input");
  wrapper.className = "shape-demo-control shape-demo-check";
  input.type = "checkbox";
  input.checked = checked;
  input.addEventListener("change", () => onChange(input.checked));
  wrapper.append(input, document.createTextNode(label));
  return wrapper;
}

function createOption(value: WebGLPerformanceTextureMode, label: string): HTMLOptionElement {
  const option = document.createElement("option");
  option.value = value;
  option.textContent = label;
  return option;
}

export const shapeVertexSource = `#version 300 es
in vec2 a_position;
in vec4 a_color;
out vec4 v_color;

void main() {
  gl_Position = vec4(a_position, 0.0, 1.0);
  v_color = a_color;
}`;

export const shapeFragmentSource = `#version 300 es
precision mediump float;
in vec4 v_color;
out vec4 outColor;

void main() {
  outColor = v_color;
}`;

export const spriteVertexSource = `#version 300 es
in vec2 a_position;
in vec2 a_uv;
in float a_alpha;
out vec2 v_uv;
out float v_alpha;

void main() {
  gl_Position = vec4(a_position, 0.0, 1.0);
  v_uv = a_uv;
  v_alpha = a_alpha;
}`;

export const spriteFragmentSource = `#version 300 es
precision mediump float;
uniform sampler2D u_texture;
in vec2 v_uv;
in float v_alpha;
out vec4 outColor;

void main() {
  vec4 texel = texture(u_texture, v_uv);
  outColor = vec4(texel.rgb, texel.a * v_alpha);
}`;

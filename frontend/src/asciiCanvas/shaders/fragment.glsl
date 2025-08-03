// fragment.glsl
precision mediump float;
varying vec2 v_texCoord;
uniform sampler2D u_texture;
uniform vec3 u_color;
uniform float u_strobe;
void main() {
  vec4 texColor = texture2D(u_texture, v_texCoord);
  float alpha = texColor.a;
  float glow = smoothstep(0.5, 2.0, alpha);
  float ambient = 0.6;
  vec3 glowColor = u_color * (ambient + u_strobe * (1.0 - ambient)) * glow;
  gl_FragColor = vec4(glowColor, alpha);
}

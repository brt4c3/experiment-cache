export function updateProjectionMatrix(out, width, height) {
  const aspect = width / height;
  out.set([
    1 / aspect, 0, 0, 0,
    0, 1, 0, 0,
    0, 0, 1, 0,
    0, 0, 0, 1
  ]);
}

export function hsvToRgb(h, s, v) {
  const c = v * s;
  const x = c * (1 - Math.abs((h / 60) % 2 - 1));
  const m = v - c;
  let [r1, g1, b1] = [0, 0, 0];
  if (h < 60) [r1, g1, b1] = [c, x, 0];
  else if (h < 120) [r1, g1, b1] = [x, c, 0];
  else if (h < 180) [r1, g1, b1] = [0, c, x];
  else if (h < 240) [r1, g1, b1] = [0, x, c];
  else if (h < 300) [r1, g1, b1] = [x, 0, c];
  else [r1, g1, b1] = [c, 0, x];
  return [r1 + m, g1 + m, b1 + m];
}

export function drawItem(gl, program, proj, uMVP, uColor, uStrobe, state) {
  const msg = state.messages[state.idx] || '';
  const [r, g, b] = hsvToRgb(state.hue, 1, 1);
  gl.uniform3f(uColor, r, g, b);
  gl.uniform1f(uStrobe, 0.5 + 0.5 * Math.sin(state.elapsed * 0.005));

  const model = new Float32Array([
    1.2, 0, 0, 0,
    0, 1.2, 0, 0,
    0, 0, 1, 0,
    0, 0, 0, 1
  ]);

  const mvp = new Float32Array(16);
  for (let i = 0; i < 16; i++) mvp[i] = proj[i] * model[i];
  gl.uniformMatrix4fv(uMVP, false, mvp);
  gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4);
}

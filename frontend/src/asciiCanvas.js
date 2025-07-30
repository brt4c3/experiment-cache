// src/asciiCanvas.js
// WebGL-based ASCII canvas renderer loading messages from messages.tsv

export default function createAsciiCanvas(canvasId) {
  const canvas = document.getElementById(canvasId);
  if (!canvas) {
    console.warn(`Canvas '#${canvasId}' not found`);
    return { destroy: () => {} };
  }
  const gl = canvas.getContext('webgl');
  if (!gl) {
    console.error('WebGL not supported');
    return { destroy: () => {} };
  }

  // Load messages from TSV file
  let messages = [];
  function loadMessages() {
    return fetch('messages.tsv')
      .then(res => res.text())
      .then(text => {
        messages = text
          .trim()
          .split('\n')
          .map(line => line.split('\t')[0]);
      })
      .catch(err => {
        console.error('Failed to load messages.tsv:', err);
        // Fallback messages
        messages = ['(ﾟ∀ﾟ)', '草', 'ｷﾀ━！'];
      });
  }

  // Vertex shader
  const vertexShaderSrc = String.raw`attribute vec4 a_position;
attribute vec2 a_texCoord;
varying vec2 v_texCoord;
uniform mat4 u_mvpMatrix;
void main() {
  gl_Position = u_mvpMatrix * a_position;
  v_texCoord = a_texCoord;
}`;

  // Fragment shader
  const fragmentShaderSrc = String.raw`precision mediump float;
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
}`;

  function compileShader(type, src) {
    const shader = gl.createShader(type);
    gl.shaderSource(shader, src);
    gl.compileShader(shader);
    if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
      console.error('Shader compile error:', gl.getShaderInfoLog(shader));
      gl.deleteShader(shader);
      return null;
    }
    return shader;
  }

  const vert = compileShader(gl.VERTEX_SHADER, vertexShaderSrc);
  const frag = compileShader(gl.FRAGMENT_SHADER, fragmentShaderSrc);
  const program = gl.createProgram();
  if (vert && frag) {
    gl.attachShader(program, vert);
    gl.attachShader(program, frag);
    gl.linkProgram(program);
    if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
      console.error('Program link error:', gl.getProgramInfoLog(program));
    }
    gl.useProgram(program);
  } else {
    return { destroy: () => {} };
  }

  // Fullscreen quad buffer: x, y, u, v
  const quadBuf = gl.createBuffer();
  gl.bindBuffer(gl.ARRAY_BUFFER, quadBuf);
  gl.bufferData(
    gl.ARRAY_BUFFER,
    new Float32Array([
      -1, -1, 0, 0,
       1, -1, 1, 0,
      -1,  1, 0, 1,
       1,  1, 1, 1
    ]),
    gl.STATIC_DRAW
  );
  const FSIZE = Float32Array.BYTES_PER_ELEMENT;
  const posLoc = gl.getAttribLocation(program, 'a_position');
  gl.vertexAttribPointer(posLoc, 2, gl.FLOAT, false, FSIZE * 4, 0);
  gl.enableVertexAttribArray(posLoc);
  const texLoc = gl.getAttribLocation(program, 'a_texCoord');
  gl.vertexAttribPointer(texLoc, 2, gl.FLOAT, false, FSIZE * 4, FSIZE * 2);
  gl.enableVertexAttribArray(texLoc);

  // Generate ASCII atlas
  const chars = [];
  for (let i = 32; i < 127; i++) chars.push(String.fromCharCode(i));
  const cols = 16;
  const cellSize = 32;
  const rows = Math.ceil(chars.length / cols);
  const atlas = document.createElement('canvas');
  atlas.width = cols * cellSize;
  atlas.height = rows * cellSize;
  const aCtx = atlas.getContext('2d');
  aCtx.fillStyle = 'black';
  aCtx.fillRect(0, 0, atlas.width, atlas.height);
  aCtx.font = `${cellSize}px monospace`;
  aCtx.textAlign = 'center';
  aCtx.textBaseline = 'middle';
  aCtx.fillStyle = 'white';

  chars.forEach((c, i) => {
    const x = (i % cols) * cellSize + cellSize / 2;
    const y = Math.floor(i / cols) * cellSize + cellSize / 2;
    aCtx.fillText(c, x, y);
  });

  // Upload atlas to texture
  const texture = gl.createTexture();
  gl.bindTexture(gl.TEXTURE_2D, texture);
  gl.texImage2D(
    gl.TEXTURE_2D,
    0,
    gl.RGBA,
    gl.RGBA,
    gl.UNSIGNED_BYTE,
    atlas
  );
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);

  const uMVP = gl.getUniformLocation(program, 'u_mvpMatrix');
  const uColor = gl.getUniformLocation(program, 'u_color');
  const uStrobe = gl.getUniformLocation(program, 'u_strobe');
  const uTexture = gl.getUniformLocation(program, 'u_texture');
  gl.uniform1i(uTexture, 0);

  // Projection matrix helper
  let proj = new Float32Array(16);
  function updateProj(width, height) {
    const aspect = width / height;
    proj.set([
      1 / aspect, 0, 0, 0,
      0, 1, 0, 0,
      0, 0, 1, 0,
      0, 0, 0, 1
    ]);
  }

  // Animation state
  let idx = 0;
  let elapsed = 0;
  let lastSwitch = 0;
  let hue = 0;
  let angle = 0;
  const switchInterval = 3000;
  let prevTime;

  function render(now) {
    if (!prevTime) prevTime = now;
    const dt = now - prevTime;
    prevTime = now;
    elapsed += dt;
    if (messages.length && elapsed - lastSwitch > switchInterval) {
      lastSwitch = elapsed;
      idx = (idx + 1) % messages.length;
      hue = Math.random() * 360;
    }
    angle += dt * 0.06;

    canvas.width = canvas.clientWidth;
    canvas.height = canvas.clientHeight;
    gl.viewport(0, 0, canvas.width, canvas.height);
    updateProj(canvas.width, canvas.height);
    gl.clearColor(0, 0, 0, 1);
    gl.clear(gl.COLOR_BUFFER_BIT);

    drawItem(0, 0, angle, 1.2);
    requestAnimationFrame(render);
  }

  function drawItem(x, y, rot, scale) {
    const msg = messages[idx] || '';
    const [r, g, b] = hsvToRgb(hue, 1, 1);
    gl.uniform3f(uColor, r, g, b);
    gl.uniform1f(uStrobe, 0.5 + 0.5 * Math.sin(elapsed * 0.005));

    const model = new Float32Array([
      scale, 0, 0, 0,
      0, scale, 0, 0,
      0, 0, 1, 0,
      x, y, 0, 1
    ]);
    const mvp = new Float32Array(16);
    for (let i = 0; i < 16; i++) {
      mvp[i] = proj[i] * model[i];
    }
    gl.uniformMatrix4fv(uMVP, false, mvp);
    gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4);
  }

  function hsvToRgb(h, s, v) {
    const c = v * s;
    const x = c * (1 - Math.abs((h / 60) % 2 - 1));
    const m = v - c;
    let r1, g1, b1;
    if (h < 60) [r1, g1, b1] = [c, x, 0];
    else if (h < 120) [r1, g1, b1] = [x, c, 0];
    else if (h < 180) [r1, g1, b1] = [0, c, x];
    else if (h < 240) [r1, g1, b1] = [0, x, c];
    else if (h < 300) [r1, g1, b1] = [x, 0, c];
    else [r1, g1, b1] = [c, 0, x];
    return [r1 + m, g1 + m, b1 + m];
  }

  // Start rendering after messages load
  loadMessages().then(() => requestAnimationFrame(render));

  return { destroy() {} };
}

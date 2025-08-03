import { compileShader, createShaderProgram } from './shaderUtils';
import { loadMessages } from './messageLoader';
import { createAsciiAtlasTexture } from './textureAtlas';
import { updateProjectionMatrix, drawItem } from './renderUtils';

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

  const vertexShaderSrc = require('./shaders/vertex.glsl');
  const fragmentShaderSrc = require('./shaders/fragment.glsl');

  const program = createShaderProgram(gl, vertexShaderSrc, fragmentShaderSrc);
  if (!program) return { destroy: () => {} };
  gl.useProgram(program);

  const texture = createAsciiAtlasTexture(gl);

  const posLoc = gl.getAttribLocation(program, 'a_position');
  const texLoc = gl.getAttribLocation(program, 'a_texCoord');

  const uMVP = gl.getUniformLocation(program, 'u_mvpMatrix');
  const uColor = gl.getUniformLocation(program, 'u_color');
  const uStrobe = gl.getUniformLocation(program, 'u_strobe');
  const uTexture = gl.getUniformLocation(program, 'u_texture');
  gl.uniform1i(uTexture, 0);

  const proj = new Float32Array(16);
  const state = { idx: 0, elapsed: 0, lastSwitch: 0, hue: 0, angle: 0, messages: [] };
  let prevTime;

  loadMessages().then(msgs => {
    state.messages = msgs;
    requestAnimationFrame(render);
  });

  function render(now) {
    if (!prevTime) prevTime = now;
    const dt = now - prevTime;
    prevTime = now;
    state.elapsed += dt;

    if (state.messages.length && state.elapsed - state.lastSwitch > 3000) {
      state.lastSwitch = state.elapsed;
      state.idx = (state.idx + 1) % state.messages.length;
      state.hue = Math.random() * 360;
    }
    state.angle += dt * 0.06;

    canvas.width = canvas.clientWidth;
    canvas.height = canvas.clientHeight;
    gl.viewport(0, 0, canvas.width, canvas.height);
    gl.clearColor(0, 0, 0, 1);
    gl.clear(gl.COLOR_BUFFER_BIT);

    updateProjectionMatrix(proj, canvas.width, canvas.height);
    drawItem(gl, program, proj, uMVP, uColor, uStrobe, state);

    requestAnimationFrame(render);
  }

  return { destroy() {} };
}

export function createAsciiAtlasTexture(gl) {
  const chars = Array.from({ length: 95 }, (_, i) => String.fromCharCode(i + 32));
  const cols = 16;
  const cellSize = 32;
  const rows = Math.ceil(chars.length / cols);

  const canvas = document.createElement('canvas');
  canvas.width = cols * cellSize;
  canvas.height = rows * cellSize;
  const ctx = canvas.getContext('2d');

  ctx.fillStyle = 'black';
  ctx.fillRect(0, 0, canvas.width, canvas.height);
  ctx.font = `${cellSize}px monospace`;
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.fillStyle = 'white';

  chars.forEach((c, i) => {
    const x = (i % cols) * cellSize + cellSize / 2;
    const y = Math.floor(i / cols) * cellSize + cellSize / 2;
    ctx.fillText(c, x, y);
  });

  const texture = gl.createTexture();
  gl.bindTexture(gl.TEXTURE_2D, texture);
  gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, canvas);
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);

  return texture;
}

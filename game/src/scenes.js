// Twin Lanterns — Spot the Difference: procedural scene art.
// One file, one job: draw the night-market stall picture on a canvas.
// Both panels share this one draw function. The left panel is drawn with
// no differences; the right panel is drawn with the level's difference ids
// in `changed`, so the two pictures are truly near-identical. Every shape
// is original vector art coded here — no image files, no external art.
import { SCENE_WIDTH, SCENE_HEIGHT } from './config.js';

// Fixed star positions, so both panels agree on the sky.
const STARS = [
  [40, 30], [90, 48], [128, 62], [170, 34], [206, 42], [240, 70], [300, 30],
  [360, 44], [420, 30], [470, 52], [500, 28], [600, 40], [620, 84], [30, 96],
  [150, 88], [260, 96], [340, 78], [440, 88], [530, 96], [590, 120],
];

function rr(ctx, x, y, w, h, r) {
  ctx.beginPath();
  ctx.roundRect(x, y, w, h, r);
}

function star(ctx, x, y, r) {
  ctx.beginPath();
  for (let i = 0; i < 8; i++) {
    const a = (i * Math.PI) / 4 - Math.PI / 2;
    const rad = i % 2 === 0 ? r : r * 0.45;
    const px = x + Math.cos(a) * rad;
    const py = y + Math.sin(a) * rad;
    if (i === 0) ctx.moveTo(px, py); else ctx.lineTo(px, py);
  }
  ctx.closePath();
}

function drawSky(ctx, changed) {
  const sky = ctx.createLinearGradient(0, 0, 0, 200);
  sky.addColorStop(0, '#171233');
  sky.addColorStop(0.55, '#3a1f5c');
  sky.addColorStop(1, '#7c3a5e');
  ctx.fillStyle = sky;
  ctx.fillRect(0, 0, SCENE_WIDTH, 200);
  ctx.fillStyle = '#ffe9a8';
  for (const [x, y] of STARS) {
    if (changed.has('missing-star') && x === 128 && y === 62) continue;
    if (changed.has('tiny-star') && x === 206 && y === 42) continue;
    star(ctx, x, y, x === 206 ? 3 : 4.5);
    ctx.fill();
  }
}

function drawMoon(ctx, changed) {
  ctx.fillStyle = '#ffe9b0';
  ctx.beginPath();
  ctx.arc(566, 56, 24, 0, Math.PI * 2);
  ctx.fill();
  if (changed.has('moon-shape')) {
    // Crescent: the same moon, bitten by a sky-coloured disc.
    ctx.fillStyle = '#2a1a4e';
    ctx.beginPath();
    ctx.arc(576, 50, 21, 0, Math.PI * 2);
    ctx.fill();
  } else {
    ctx.fillStyle = '#e8c97e';
    ctx.beginPath();
    ctx.arc(556, 48, 4, 0, Math.PI * 2);
    ctx.arc(574, 64, 3, 0, Math.PI * 2);
    if (!changed.has('moon-crater')) {
      ctx.arc(566, 58, 2.4, 0, Math.PI * 2);
    }
    ctx.fill();
  }
}

function drawFireworks(ctx) {
  // Level 3 only: two small firework bursts in the corners of the sky.
  for (const [cx, cy, col] of [[84, 128, '#ffd166'], [556, 132, '#7ee0d2']]) {
    ctx.strokeStyle = col;
    ctx.lineWidth = 2;
    for (let i = 0; i < 10; i++) {
      const a = (i / 10) * Math.PI * 2;
      ctx.beginPath();
      ctx.moveTo(cx + Math.cos(a) * 6, cy + Math.sin(a) * 6);
      ctx.lineTo(cx + Math.cos(a) * 20, cy + Math.sin(a) * 20);
      ctx.stroke();
    }
    ctx.fillStyle = col;
    ctx.beginPath();
    ctx.arc(cx, cy, 3, 0, Math.PI * 2);
    ctx.fill();
  }
}

function drawLantern(ctx, x, y, w, h, body, glow) {
  // Paper lantern: glowing body, gold caps, hanging tassel.
  ctx.strokeStyle = '#8a6d3b';
  ctx.lineWidth = 2;
  ctx.beginPath();
  ctx.moveTo(x, y - 26);
  ctx.lineTo(x, y - h / 2);
  ctx.stroke();
  const g = ctx.createRadialGradient(x, y, 4, x, y, w);
  g.addColorStop(0, glow);
  g.addColorStop(1, 'rgba(0,0,0,0)');
  ctx.fillStyle = g;
  ctx.beginPath();
  ctx.arc(x, y, w, 0, Math.PI * 2);
  ctx.fill();
  ctx.fillStyle = body;
  ctx.beginPath();
  ctx.ellipse(x, y, w / 2, h / 2, 0, 0, Math.PI * 2);
  ctx.fill();
  ctx.strokeStyle = 'rgba(120,40,20,0.55)';
  ctx.lineWidth = 1.5;
  for (const dy of [-h / 4, 0, h / 4]) {
    ctx.beginPath();
    ctx.ellipse(x, y + dy, w / 2 - 2, h / 2 - 4, 0, 0, Math.PI * 2);
    ctx.stroke();
  }
  ctx.fillStyle = '#f7c948';
  ctx.fillRect(x - 7, y - h / 2 - 4, 14, 5);
  ctx.fillRect(x - 7, y + h / 2 - 1, 14, 5);
  return { x, y, h };
}

function drawLanternsAndLights(ctx, changed) {
  // A sagging string of warm bulbs across the top of the scene.
  ctx.strokeStyle = '#2c2140';
  ctx.lineWidth = 2;
  ctx.beginPath();
  ctx.moveTo(0, 34);
  ctx.quadraticCurveTo(320, 74, SCENE_WIDTH, 34);
  ctx.stroke();
  for (let i = 0; i < 9; i++) {
    const x = 40 + i * 70;
    const y = 36 + Math.sin((i / 8) * Math.PI) * 22;
    if (changed.has('bulb-out') && i === 3) {
      ctx.fillStyle = '#5a4a72';
      ctx.beginPath();
      ctx.arc(x, y + 8, 5, 0, Math.PI * 2);
      ctx.fill();
      continue;
    }
    ctx.fillStyle = '#ffd166';
    ctx.beginPath();
    ctx.arc(x, y + 8, 5, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillStyle = 'rgba(255,209,102,0.25)';
    ctx.beginPath();
    ctx.arc(x, y + 8, 10, 0, Math.PI * 2);
    ctx.fill();
  }
  // Five paper lanterns hang below the string.
  const spots = [
    [90, 92, '#e4572e'], [200, 98, '#e4572e'],
    [320, 100, '#e4572e'], [440, 98, '#e4572e'], [550, 92, '#e4572e'],
  ];
  spots.forEach(([x, y, colour], i) => {
    let body = colour;
    let glow = 'rgba(255,150,80,0.5)';
    if (changed.has('lantern-color') && i === 2) {
      body = '#2a9d8f';
      glow = 'rgba(80,220,200,0.5)';
    }
    drawLantern(ctx, x, y, 34, 44, body, glow);
    // Tassel under the middle-right lantern (level 3 difference).
    if (i === 3 && !changed.has('lantern-tassel')) {
      ctx.strokeStyle = '#f7c948';
      ctx.lineWidth = 3;
      ctx.beginPath();
      ctx.moveTo(x, y + 26);
      ctx.lineTo(x, y + 40);
      ctx.stroke();
    }
  });
  // Level 2: a tiny extra lantern appears low on the left.
  if (changed.has('lantern-extra')) {
    drawLantern(ctx, 64, 118, 20, 26, '#e4572e', 'rgba(255,150,80,0.5)');
  }
}

function drawAwning(ctx, changed) {
  // Striped festival awning over the stall.
  const stripeW = 52;
  for (let i = 0; i < 10; i++) {
    let colour = i % 2 === 0 ? '#d64545' : '#fdf3d8';
    if (changed.has('awning-stripe') && i === 2) colour = '#2a9d8f';
    ctx.fillStyle = colour;
    ctx.beginPath();
    ctx.moveTo(60 + i * stripeW, 122);
    ctx.lineTo(60 + (i + 1) * stripeW, 122);
    ctx.lineTo(60 + (i + 1) * stripeW + 8, 158);
    ctx.lineTo(60 + i * stripeW + 8, 158);
    ctx.closePath();
    ctx.fill();
  }
  ctx.fillStyle = '#8a3324';
  ctx.fillRect(56, 158, 528, 6);
  // Scalloped edge.
  ctx.fillStyle = '#d64545';
  for (let i = 0; i < 10; i++) {
    ctx.beginPath();
    ctx.arc(86 + i * 52, 164, 12, 0, Math.PI);
    ctx.fill();
  }
  // Tie rope on the right end (level 3 difference).
  if (!changed.has('awning-rope')) {
    ctx.strokeStyle = '#f7c948';
    ctx.lineWidth = 3;
    ctx.beginPath();
    ctx.moveTo(566, 146);
    ctx.lineTo(566, 176);
    ctx.stroke();
    ctx.beginPath();
    ctx.arc(566, 180, 4, 0, Math.PI * 2);
    ctx.fill();
  }
}

function drawWall(ctx, changed) {
  ctx.fillStyle = '#6b4a2f';
  ctx.fillRect(60, 164, 520, 160);
  ctx.strokeStyle = 'rgba(0,0,0,0.25)';
  ctx.lineWidth = 2;
  for (let y = 196; y < 324; y += 32) {
    ctx.beginPath();
    ctx.moveTo(60, y);
    ctx.lineTo(580, y);
    ctx.stroke();
  }
  // Small window, lit warm — or dark on the right panel (level 2).
  ctx.fillStyle = changed.has('window-light') ? '#2c2140' : '#ffd166';
  ctx.fillRect(416, 168, 40, 34);
  ctx.strokeStyle = '#3a2a1a';
  ctx.lineWidth = 3;
  ctx.strokeRect(416, 168, 40, 34);
  ctx.beginPath();
  ctx.moveTo(436, 168);
  ctx.lineTo(436, 202);
  ctx.moveTo(416, 185);
  ctx.lineTo(456, 185);
  ctx.stroke();
  // String of red chillies beside the window.
  ctx.strokeStyle = '#2c2140';
  ctx.lineWidth = 2;
  ctx.beginPath();
  ctx.moveTo(486, 168);
  ctx.lineTo(486, 200);
  ctx.stroke();
  for (let i = 0; i < 4; i++) {
    if (changed.has('chili-missing') && i === 2) continue;
    const y = 176 + i * 8;
    ctx.fillStyle = '#c0392b';
    ctx.beginPath();
    ctx.ellipse(486, y, 4, 8, 0.3, 0, Math.PI * 2);
    ctx.fill();
  }
}

function drawSign(ctx, changed) {
  // Hanging wooden sign over the counter.
  ctx.fillStyle = '#3a2a1a';
  ctx.fillRect(268, 186, 104, 8);
  ctx.strokeStyle = '#2c2140';
  ctx.lineWidth = 2;
  ctx.beginPath();
  ctx.moveTo(280, 194);
  ctx.lineTo(280, 206);
  ctx.moveTo(360, 194);
  ctx.lineTo(360, 206);
  ctx.stroke();
  ctx.fillStyle = '#fdf3d8';
  rr(ctx, 252, 204, 136, 40, 8);
  ctx.fill();
  ctx.strokeStyle = '#8a6d3b';
  ctx.lineWidth = 3;
  rr(ctx, 252, 204, 136, 40, 8);
  ctx.stroke();
  ctx.fillStyle = '#8a3324';
  ctx.font = 'bold 17px Georgia, serif';
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  const word = changed.has('sign-word') ? 'SOTO' : 'SATE';
  ctx.fillText(`${word} \u2022 BAKSO`, 320, 222);
  if (!changed.has('sign-dot')) {
    ctx.fillStyle = '#d64545';
    ctx.beginPath();
    ctx.arc(366, 196, 4, 0, Math.PI * 2);
    ctx.fill();
  }
}

function drawShelf(ctx, changed) {
  ctx.fillStyle = '#4a3220';
  ctx.fillRect(372, 262, 140, 8);
  const jars = [
    { x: 396, fill: '#f4a259', label: '#2a9d8f' },
    { x: 440, fill: '#e9c46a', label: '#e4572e' },
    { x: 484, fill: '#8ab17d', label: '#f7c948' },
  ];
  jars.forEach((jar, i) => {
    if (changed.has('jar-missing') && i === 1) return;
    ctx.fillStyle = 'rgba(255,255,255,0.28)';
    rr(ctx, jar.x - 15, 226, 30, 36, 8);
    ctx.fill();
    ctx.fillStyle = jar.fill;
    rr(ctx, jar.x - 13, 238, 26, 24, 6);
    ctx.fill();
    let label = jar.label;
    if (changed.has('jar-label') && i === 0) label = '#d64545';
    ctx.fillStyle = label;
    ctx.fillRect(jar.x - 10, 244, 20, 10);
    ctx.fillStyle = '#8a6d3b';
    ctx.fillRect(jar.x - 12, 222, 24, 6);
  });
}

function drawBowl(ctx, x, y, withSteam) {
  if (withSteam) {
    ctx.strokeStyle = 'rgba(255,255,255,0.65)';
    ctx.lineWidth = 2;
    for (const dx of [-8, 0, 8]) {
      ctx.beginPath();
      ctx.moveTo(x + dx, y - 12);
      ctx.quadraticCurveTo(x + dx + 5, y - 22, x + dx, y - 30);
      ctx.stroke();
    }
  }
  ctx.fillStyle = '#e4572e';
  ctx.beginPath();
  ctx.ellipse(x, y, 22, 10, 0, 0, Math.PI);
  ctx.fill();
  ctx.fillStyle = '#fdf3d8';
  ctx.beginPath();
  ctx.ellipse(x, y, 22, 10, 0, Math.PI, Math.PI * 2);
  ctx.fill();
  ctx.fillStyle = '#f4a259';
  ctx.beginPath();
  ctx.ellipse(x, y - 2, 17, 6, 0, 0, Math.PI * 2);
  ctx.fill();
  ctx.fillStyle = '#2a9d8f';
  ctx.beginPath();
  ctx.arc(x - 6, y - 3, 2.5, 0, Math.PI * 2);
  ctx.arc(x + 6, y - 3, 2.5, 0, Math.PI * 2);
  ctx.fill();
}

function drawCounter(ctx, changed) {
  // Wooden counter with bowls, a basket of oranges and the cat.
  ctx.fillStyle = '#7a5230';
  ctx.fillRect(40, 324, 560, 14);
  ctx.fillStyle = '#5d3d22';
  ctx.fillRect(40, 338, 560, 44);
  ctx.strokeStyle = 'rgba(0,0,0,0.3)';
  ctx.lineWidth = 2;
  ctx.beginPath();
  ctx.moveTo(40, 360);
  ctx.lineTo(600, 360);
  ctx.stroke();
  drawBowl(ctx, 214, 330, !changed.has('bowl-steam'));
  if (changed.has('extra-bowl')) drawBowl(ctx, 252, 336, false);
  // Spoon leaning on the first bowl (level 3 difference).
  if (!changed.has('spoon-missing')) {
    ctx.strokeStyle = '#c9c9c9';
    ctx.lineWidth = 3;
    ctx.beginPath();
    ctx.moveTo(284, 322);
    ctx.lineTo(292, 306);
    ctx.stroke();
    ctx.fillStyle = '#c9c9c9';
    ctx.beginPath();
    ctx.ellipse(293, 303, 4, 6, 0.4, 0, Math.PI * 2);
    ctx.fill();
  }
  // Basket of oranges.
  ctx.fillStyle = '#8a6d3b';
  ctx.beginPath();
  ctx.moveTo(332, 352);
  ctx.lineTo(380, 352);
  ctx.lineTo(374, 378);
  ctx.lineTo(338, 378);
  ctx.closePath();
  ctx.fill();
  const oranges = [[342, 348], [356, 344], [370, 348], [349, 356], [363, 356]];
  oranges.forEach(([x, y], i) => {
    if (changed.has('orange-missing') && i === 2) return;
    ctx.fillStyle = '#f4842b';
    ctx.beginPath();
    ctx.arc(x, y, 8, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillStyle = '#2a9d8f';
    ctx.beginPath();
    ctx.arc(x + 2, y - 7, 3, 0, Math.PI * 2);
    ctx.fill();
  });
}

function drawCat(ctx, changed) {
  // Orange tabby cat sitting on the counter, facing left.
  const x = 508;
  const y = 330;
  ctx.fillStyle = '#e8912d';
  ctx.beginPath();
  ctx.ellipse(x, y, 26, 20, 0, 0, Math.PI * 2);
  ctx.fill();
  ctx.beginPath();
  ctx.arc(x - 6, y - 22, 15, 0, Math.PI * 2);
  ctx.fill();
  // Ears; the left ear tip changes colour on the right panel (level 3).
  ctx.beginPath();
  ctx.moveTo(x - 18, y - 30);
  ctx.lineTo(x - 14, y - 42);
  ctx.lineTo(x - 8, y - 32);
  ctx.closePath();
  ctx.fillStyle = changed.has('cat-ear') ? '#2a9d8f' : '#e8912d';
  ctx.fill();
  ctx.beginPath();
  ctx.moveTo(x - 2, y - 34);
  ctx.lineTo(x + 2, y - 44);
  ctx.lineTo(x + 8, y - 32);
  ctx.closePath();
  ctx.fillStyle = '#e8912d';
  ctx.fill();
  ctx.fillStyle = '#f7c948';
  ctx.beginPath();
  ctx.arc(x - 10, y - 24, 2.5, 0, Math.PI * 2);
  ctx.arc(x - 2, y - 24, 2.5, 0, Math.PI * 2);
  ctx.fill();
  ctx.fillStyle = '#3a2a1a';
  ctx.beginPath();
  ctx.arc(x - 10, y - 24, 1.2, 0, Math.PI * 2);
  ctx.arc(x - 2, y - 24, 1.2, 0, Math.PI * 2);
  ctx.fill();
  // Tail, curled up — missing on the right panel (level 1).
  if (!changed.has('cat-tail')) {
    ctx.strokeStyle = '#e8912d';
    ctx.lineWidth = 7;
    ctx.lineCap = 'round';
    ctx.beginPath();
    ctx.moveTo(x + 22, y + 8);
    ctx.quadraticCurveTo(x + 44, y - 2, x + 38, y - 22);
    ctx.stroke();
    ctx.strokeStyle = '#c96f1e';
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(x + 36, y - 14);
    ctx.lineTo(x + 42, y - 10);
    ctx.moveTo(x + 40, y - 6);
    ctx.lineTo(x + 44, y - 2);
    ctx.stroke();
  }
  // Stripes.
  ctx.strokeStyle = '#c96f1e';
  ctx.lineWidth = 2;
  for (const dx of [-14, -6, 2]) {
    ctx.beginPath();
    ctx.moveTo(x + dx, y - 12);
    ctx.lineTo(x + dx, y - 2);
    ctx.stroke();
  }
}

function drawCart(ctx, changed) {
  // Little food cart on the left, with a striped canopy.
  ctx.fillStyle = '#2a9d8f';
  ctx.beginPath();
  ctx.moveTo(56, 372);
  ctx.lineTo(150, 372);
  ctx.lineTo(150, 388);
  ctx.lineTo(56, 388);
  ctx.closePath();
  ctx.fill();
  ctx.fillStyle = '#e4572e';
  ctx.fillRect(56, 372, 94, 6);
  ctx.fillStyle = '#7a5230';
  ctx.fillRect(60, 388, 86, 12);
  // Wheels; the front wheel is gone on the right panel (level 2).
  ctx.fillStyle = '#3a2a1a';
  ctx.beginPath();
  ctx.arc(72, 408, 10, 0, Math.PI * 2);
  ctx.fill();
  if (!changed.has('cart-wheel')) {
    ctx.beginPath();
    ctx.arc(96, 408, 10, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillStyle = '#f7c948';
    ctx.beginPath();
    ctx.arc(96, 408, 4, 0, Math.PI * 2);
    ctx.fill();
  }
  ctx.fillStyle = '#f7c948';
  ctx.beginPath();
  ctx.arc(72, 408, 4, 0, Math.PI * 2);
  ctx.fill();
  // Two satay skewers sticking out of the cart.
  ctx.strokeStyle = '#f7c948';
  ctx.lineWidth = 3;
  ctx.beginPath();
  ctx.moveTo(84, 372);
  ctx.lineTo(84, 352);
  ctx.moveTo(96, 372);
  ctx.lineTo(96, 352);
  ctx.stroke();
  ctx.fillStyle = '#c0392b';
  ctx.beginPath();
  ctx.arc(84, 350, 4, 0, Math.PI * 2);
  ctx.arc(96, 350, 4, 0, Math.PI * 2);
  ctx.fill();
}

function drawPlant(ctx, changed) {
  // Potted plant on the right end of the counter.
  ctx.fillStyle = '#c0392b';
  ctx.beginPath();
  ctx.moveTo(576, 372);
  ctx.lineTo(608, 372);
  ctx.lineTo(604, 396);
  ctx.lineTo(580, 396);
  ctx.closePath();
  ctx.fill();
  ctx.strokeStyle = '#2a7d4f';
  ctx.lineWidth = 3;
  ctx.beginPath();
  ctx.moveTo(592, 372);
  ctx.lineTo(592, 352);
  ctx.moveTo(592, 360);
  ctx.lineTo(580, 348);
  ctx.moveTo(592, 360);
  ctx.lineTo(604, 348);
  ctx.stroke();
  ctx.fillStyle = changed.has('plant-flower') ? '#2a9d8f' : '#e85d9e';
  ctx.beginPath();
  ctx.arc(592, 348, 7, 0, Math.PI * 2);
  ctx.fill();
  ctx.fillStyle = '#ffd166';
  ctx.beginPath();
  ctx.arc(592, 348, 3, 0, Math.PI * 2);
  ctx.fill();
}

function drawGround(ctx, changed) {
  ctx.fillStyle = '#4a3560';
  ctx.fillRect(0, 382, SCENE_WIDTH, 78);
  ctx.fillStyle = '#5d4470';
  for (let row = 0; row < 3; row++) {
    for (let col = 0; col < 9; col++) {
      const x = col * 74 + (row % 2 === 0 ? 0 : 37) - 10;
      const y = 390 + row * 24;
      let colour = '#5d4470';
      if (changed.has('cobble-shade') && row === 1 && col === 2) colour = '#8a6d9e';
      ctx.fillStyle = colour;
      rr(ctx, x, y, 64, 18, 8);
      ctx.fill();
    }
  }
  // Warm light pooling under the stall.
  const glow = ctx.createRadialGradient(320, 400, 10, 320, 400, 220);
  glow.addColorStop(0, 'rgba(255,190,90,0.18)');
  glow.addColorStop(1, 'rgba(255,190,90,0)');
  ctx.fillStyle = glow;
  ctx.fillRect(0, 382, SCENE_WIDTH, 78);
}

function drawVignette(ctx) {
  // A soft darkening at the picture's edges, so the stall sits in a pool
  // of lantern light. Applied equally to both panels, it changes nothing
  // about the differences — it only deepens the night.
  const v = ctx.createRadialGradient(
    SCENE_WIDTH / 2, SCENE_HEIGHT / 2, SCENE_HEIGHT * 0.42,
    SCENE_WIDTH / 2, SCENE_HEIGHT / 2, SCENE_HEIGHT * 0.85,
  );
  v.addColorStop(0, 'rgba(10,6,24,0)');
  v.addColorStop(1, 'rgba(10,6,24,0.28)');
  ctx.fillStyle = v;
  ctx.fillRect(0, 0, SCENE_WIDTH, SCENE_HEIGHT);
}

// Draw the whole scene. `changed` is a Set of difference ids that this
// panel shows in its altered form; an empty Set draws the original.
export function drawScene(ctx, level, changed) {
  ctx.clearRect(0, 0, SCENE_WIDTH, SCENE_HEIGHT);
  drawSky(ctx, changed);
  drawMoon(ctx, changed);
  if (level >= 3) drawFireworks(ctx);
  drawLanternsAndLights(ctx, changed);
  drawAwning(ctx, changed);
  drawWall(ctx, changed);
  drawGround(ctx, changed);
  drawSign(ctx, changed);
  drawShelf(ctx, changed);
  drawCounter(ctx, changed);
  drawCat(ctx, changed);
  drawCart(ctx, changed);
  drawPlant(ctx, changed);
  drawVignette(ctx);
}

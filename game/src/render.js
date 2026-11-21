// Twin Lanterns — Spot the Difference: markers and overlays.
// One file, one job: everything drawn on top of the two pictures — found
// markers, the hint pulse, the wrong-click ripple — plus the DOM overlay
// screens (title, level complete, game complete, time out).
import { SCENE_WIDTH, SCENE_HEIGHT } from './config.js';

// A satisfying found marker: a green ring with a white check, drawn on
// both panels at the same spot, with a soft glow behind it.
export function drawFoundMarker(ctx, x, y, radius, index) {
  ctx.save();
  ctx.strokeStyle = 'rgba(126, 224, 129, 0.35)';
  ctx.lineWidth = 10;
  ctx.beginPath();
  ctx.arc(x, y, radius + 2, 0, Math.PI * 2);
  ctx.stroke();
  ctx.strokeStyle = '#7ee081';
  ctx.lineWidth = 4;
  ctx.beginPath();
  ctx.arc(x, y, radius, 0, Math.PI * 2);
  ctx.stroke();
  ctx.fillStyle = 'rgba(126, 224, 129, 0.18)';
  ctx.beginPath();
  ctx.arc(x, y, radius, 0, Math.PI * 2);
  ctx.fill();
  // White check mark.
  ctx.strokeStyle = '#ffffff';
  ctx.lineWidth = 5;
  ctx.lineCap = 'round';
  ctx.lineJoin = 'round';
  ctx.beginPath();
  ctx.moveTo(x - radius * 0.45, y);
  ctx.lineTo(x - radius * 0.12, y + radius * 0.35);
  ctx.lineTo(x + radius * 0.5, y - radius * 0.35);
  ctx.stroke();
  // Small number badge, so the player can count their finds on the picture.
  ctx.fillStyle = '#2f7d32';
  ctx.beginPath();
  ctx.arc(x + radius * 0.75, y - radius * 0.75, 11, 0, Math.PI * 2);
  ctx.fill();
  ctx.fillStyle = '#ffffff';
  ctx.font = 'bold 13px system-ui, sans-serif';
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.fillText(String(index), x + radius * 0.75, y - radius * 0.75 + 0.5);
  ctx.restore();
}

// The hint pulse: an expanding golden ring that breathes around a
// still-hidden difference for a few seconds.
export function drawHintPulse(ctx, x, y, radius, ageMs) {
  const phase = (ageMs % 900) / 900;
  const r = radius + phase * 16;
  ctx.save();
  ctx.globalAlpha = 1 - phase;
  ctx.strokeStyle = '#ffd166';
  ctx.lineWidth = 5;
  ctx.beginPath();
  ctx.arc(x, y, r, 0, Math.PI * 2);
  ctx.stroke();
  ctx.globalAlpha = (1 - phase) * 0.5;
  ctx.fillStyle = '#ffd166';
  ctx.beginPath();
  ctx.arc(x, y, radius * 0.6, 0, Math.PI * 2);
  ctx.fill();
  ctx.restore();
}

// The wrong-click ripple: a short-lived red X that fades where the player
// clicked but found nothing.
export function drawWrongRipple(ctx, x, y, ageMs) {
  const life = 1 - ageMs / 450;
  if (life <= 0) return;
  ctx.save();
  ctx.globalAlpha = life;
  ctx.strokeStyle = '#ff6b6b';
  ctx.lineWidth = 4;
  ctx.lineCap = 'round';
  const s = 10;
  ctx.beginPath();
  ctx.moveTo(x - s, y - s);
  ctx.lineTo(x + s, y + s);
  ctx.moveTo(x + s, y - s);
  ctx.lineTo(x - s, y + s);
  ctx.stroke();
  ctx.restore();
}

// ---- DOM overlay screens -------------------------------------------------

function overlayRoot() {
  return document.getElementById('overlay');
}

function showOverlay(html) {
  const root = overlayRoot();
  root.innerHTML = html;
  root.classList.add('visible');
}

export function hideOverlay() {
  const root = overlayRoot();
  root.innerHTML = '';
  root.classList.remove('visible');
}

export function showTitleScreen(onStart) {
  showOverlay(`
    <div class="panel">
      <div class="eyebrow">A night-market hunt</div>
      <h1>Twin Lanterns</h1>
      <p class="tagline">Spot the Difference</p>
      <p class="rules">Two pictures of the same lantern stall — but one hides
        <b>7&ndash;10 tiny changes</b>. Click a difference on <b>either</b> picture
        to mark it. Find them all before the lanterns burn down.</p>
      <p class="keys"><b>Click</b> find &nbsp;&middot;&nbsp; <b>H</b> hint &nbsp;&middot;&nbsp;
        <b>N</b> next level &nbsp;&middot;&nbsp; <b>R</b> restart &nbsp;&middot;&nbsp;
        <b>1 / 2 / 3</b> jump to a level</p>
      <button id="start-btn" class="big-btn">Light the lanterns &mdash; Play</button>
      <p class="levels-note">3 levels &middot; 25 differences &middot; original art, drawn in code</p>
    </div>`);
  document.getElementById('start-btn').addEventListener('click', onStart);
}

export function showLevelComplete({ levelName, level, found, total, timeLeft, score, stars, onNext, onReplay }) {
  const starRow = '★'.repeat(stars) + '☆'.repeat(3 - stars);
  showOverlay(`
    <div class="panel">
      <div class="eyebrow">Level ${level} clear</div>
      <h1>${levelName}</h1>
      <div class="stars">${starRow}</div>
      <p class="result-line">Found <b>${found} / ${total}</b> differences &middot;
        <b>${timeLeft}s</b> to spare &middot; score <b>${score}</b></p>
      <p class="tagline">The next stall is even trickier&hellip;</p>
      <button id="next-btn" class="big-btn">Next level &rsaquo;</button>
      <button id="replay-btn" class="ghost-btn">Replay this level</button>
    </div>`);
  document.getElementById('next-btn').addEventListener('click', onNext);
  document.getElementById('replay-btn').addEventListener('click', onReplay);
}

export function showGameComplete({ score, totalFound, total, onReplay }) {
  showOverlay(`
    <div class="panel">
      <div class="eyebrow">Festival complete</div>
      <h1>All Lanterns Lit!</h1>
      <div class="stars">★★★</div>
      <p class="result-line">You found <b>${totalFound} / ${total}</b> differences across 3 levels.</p>
      <p class="tagline">Final score: <b>${score}</b></p>
      <button id="again-btn" class="big-btn">Play again</button>
    </div>`);
  document.getElementById('again-btn').addEventListener('click', onReplay);
}

export function showTimeOut({ found, total, onRetry }) {
  showOverlay(`
    <div class="panel">
      <div class="eyebrow">Time&rsquo;s up</div>
      <h1>The lanterns burned down</h1>
      <p class="result-line">You found <b>${found} / ${total}</b> differences.</p>
      <p class="tagline">So close — the stall is still waiting.</p>
      <button id="retry-btn" class="big-btn">Try again</button>
    </div>`);
  document.getElementById('retry-btn').addEventListener('click', onRetry);
}

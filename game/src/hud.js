// Twin Lanterns — Spot the Difference: the HUD.
// One file, one job: keep the top bar honest — the found counter, the
// timer, the score, the level name and the hint button. The counter is the
// heart of the game, so it is big and always visible.
import { LEVELS } from './config.js';

function $(id) {
  return document.getElementById(id);
}

export function setLevelName(levelIndex) {
  const level = LEVELS[levelIndex];
  $('level-name').textContent = `Level ${level.id} — ${level.name}`;
  $('level-tagline').textContent = level.tagline;
}

// "Found 3 / 7 — 4 remain": the number found, the total, and how many are
// still hiding. The remain count is what the player hunts against.
export function setCounter(found, total) {
  $('counter-found').textContent = String(found);
  $('counter-total').textContent = String(total);
  $('counter-remain').textContent = String(total - found);
  $('counter').classList.toggle('done', found === total);
  // Keep the screen-reader status line in step with the visible counter.
  const status = document.getElementById('status');
  if (status) status.textContent = `Found ${found} of ${total} differences, ${total - found} remain.`;
}

// mm:ss, red and pulsing under ten seconds so the pressure is visible.
export function setTimer(secondsLeft) {
  const el = $('timer');
  const s = Math.max(0, Math.ceil(secondsLeft));
  const mm = String(Math.floor(s / 60)).padStart(2, '0');
  const ss = String(s % 60).padStart(2, '0');
  el.textContent = `${mm}:${ss}`;
  el.classList.toggle('urgent', s <= 10 && s > 0);
  el.classList.toggle('empty', s === 0);
}

export function setScore(score) {
  $('score').textContent = String(score);
}

export function setHintsLeft(hintsLeft) {
  const btn = $('hint-btn');
  btn.textContent = `💡 Hint (${hintsLeft})`;
  btn.disabled = hintsLeft <= 0;
}

// A one-line message under the counter ("Lantern changed colour! +100").
export function setMessage(text, kind) {
  const el = $('message');
  el.textContent = text;
  el.className = `message ${kind || ''}`;
}

// Shake the whole play area briefly on a wrong click.
export function shakePanels() {
  const wrap = $('panels');
  wrap.classList.remove('shake');
  void wrap.offsetWidth; // restart the animation
  wrap.classList.add('shake');
}

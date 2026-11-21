// Twin Lanterns — Spot the Difference: mouse and keyboard input.
// One file, one job: turn clicks on either picture and key presses into
// game actions. Clicks are mapped from screen pixels back into scene
// coordinates, then tested against the still-hidden differences.
import { SCENE_WIDTH, SCENE_HEIGHT } from './config.js';

// Convert a pointer event on a canvas into scene coordinates, clamped to
// the scene so a click just outside the picture still maps onto its edge.
export function eventToSceneCoords(canvas, event) {
  const rect = canvas.getBoundingClientRect();
  const x = ((event.clientX - rect.left) / rect.width) * SCENE_WIDTH;
  const y = ((event.clientY - rect.top) / rect.height) * SCENE_HEIGHT;
  return {
    x: Math.max(0, Math.min(SCENE_WIDTH, x)),
    y: Math.max(0, Math.min(SCENE_HEIGHT, y)),
  };
}

// Find the nearest still-hidden difference within CLICK_RADIUS of a point,
// or null when the click lands on nothing.
export function pickDifferenceAt(differences, foundIds, x, y, radius) {
  let best = null;
  let bestDist = radius;
  for (const diff of differences) {
    if (foundIds.has(diff.id)) continue;
    const dist = Math.hypot(diff.x - x, diff.y - y);
    if (dist <= bestDist) {
      best = diff;
      bestDist = dist;
    }
  }
  return best;
}

// Wire both picture canvases to one click handler. The handler receives
// the scene coordinates of the click and which panel was clicked.
export function bindPanelClicks(leftCanvas, rightCanvas, onClick) {
  for (const [canvas, panel] of [[leftCanvas, 'left'], [rightCanvas, 'right']]) {
    canvas.addEventListener('pointerdown', (event) => {
      const { x, y } = eventToSceneCoords(canvas, event);
      onClick({ x, y, panel });
    });
  }
}

// Wire the keyboard: H hint, N next level, R restart, 1/2/3 jump levels,
// M mute, Enter start. Returns an unsubscribe function.
export function bindKeyboard(actions) {
  const handler = (event) => {
    if (event.repeat) return;
    const key = event.key.toLowerCase();
    if (key === 'h') actions.onHint();
    else if (key === 'n') actions.onNext();
    else if (key === 'r') actions.onRestart();
    else if (key === 'm') actions.onMute();
    else if (key === '1' || key === '2' || key === '3') actions.onJump(Number(key));
    else if (key === 'enter') actions.onConfirm();
  };
  window.addEventListener('keydown', handler);
  return () => window.removeEventListener('keydown', handler);
}

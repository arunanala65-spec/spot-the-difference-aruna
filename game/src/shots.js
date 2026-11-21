// Twin Lanterns — Spot the Difference: deterministic demo states.
// One file, one job: read ?shot= from the URL and pre-set the game into a
// fixed, readable state for screenshots. These are real renders of the
// game's own code — the same state machine, timer and markers a player
// reaches by playing — with the clock frozen so every capture is identical.
//
//   ?shot=cover   Level 1 mid-play: 3 found with markers, 4 still hidden,
//                 counter reads "Found 3 / 7 — 4 remain", 01:47 on the clock.
//   ?shot=level2  Level 2 mid-play: 5 of 8 found, 02:00 on the clock.
//   ?shot=win     Level 1 complete screen: 7/7, three stars, score shown.
//   ?shot=hint    Level 1 with a hint pulsing on a hidden difference.
import { DIFFERENCES } from './differences.js';
import { LEVEL_TIMERS } from './config.js';

// The demo state for a shot name, or null for normal play.
export const SHOT_NAMES = ['cover', 'level2', 'win', 'hint'];

export function demoStateFor(shot) {
  const params = new URLSearchParams(window.location.search);
  const name = shot || params.get('shot');
  if (!name) return null;
  switch (name) {
    case 'cover':
      return {
        level: 1,
        foundIds: DIFFERENCES[1].slice(0, 3).map((d) => d.id),
        secondsLeft: 107,
        hintId: null,
        screen: 'playing',
      };
    case 'level2':
      return {
        level: 2,
        foundIds: DIFFERENCES[2].slice(0, 5).map((d) => d.id),
        secondsLeft: 120,
        hintId: null,
        screen: 'playing',
      };
    case 'win':
      return {
        level: 1,
        foundIds: DIFFERENCES[1].map((d) => d.id),
        secondsLeft: 63,
        hintId: null,
        screen: 'level-complete',
        score: 700 + 63 * 5,
      };
    case 'hint':
      return {
        level: 1,
        foundIds: DIFFERENCES[1].slice(0, 2).map((d) => d.id),
        secondsLeft: 98,
        hintId: DIFFERENCES[1][5].id,
        screen: 'playing',
      };
    default:
      return null;
  }
}

// Seconds shown on the clock for a demo state (the timer is frozen there).
export function demoSecondsLeft(state) {
  return state ? state.secondsLeft : LEVEL_TIMERS[0];
}

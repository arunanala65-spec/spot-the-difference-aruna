// Twin Lanterns — Spot the Difference: game configuration.
// One file, one job: every tunable number of the game lives here.
export const SCENE_WIDTH = 640;
export const SCENE_HEIGHT = 460;

export const GAME_TITLE = 'Twin Lanterns';
export const GAME_SUBTITLE = 'Spot the Difference — Night Market Festival';

// Seconds allowed per level, in level order.
export const LEVEL_TIMERS = [120, 120, 150];

// Hints the player may spend on each level.
export const HINTS_PER_LEVEL = 3;

// Points for one found difference, and the cost of one hint.
export const POINTS_PER_FIND = 100;
export const HINT_COST = 25;

// Seconds lost on a wrong click.
export const WRONG_CLICK_PENALTY_SECONDS = 5;

// Click tolerance, in scene pixels, around a difference centre.
export const CLICK_RADIUS = 30;

// Time bonus: points per second left when a level is cleared.
export const TIME_BONUS_PER_SECOND = 5;

// How long a hint pulse and a wrong-click ripple stay visible (ms).
export const HINT_PULSE_MS = 2600;
export const WRONG_RIPPLE_MS = 450;

// Level names shown in the HUD and on the level-complete screen.
export const LEVELS = [
  { id: 1, name: 'Lantern Row', tagline: 'Warm up — the lanterns are watching', differences: 7 },
  { id: 2, name: 'Market Rush', tagline: 'The stall gets busier — look closer', differences: 8 },
  { id: 3, name: 'Midnight Festival', tagline: 'Fireworks, crowds, tiny tricks', differences: 10 },
];

// Stars awarded at level end from the seconds left on the clock.
export function starsForTimeLeft(secondsLeft, levelIndex) {
  const total = LEVEL_TIMERS[levelIndex];
  if (secondsLeft >= total * 0.5) return 3;
  if (secondsLeft >= total * 0.25) return 2;
  return 1;
}

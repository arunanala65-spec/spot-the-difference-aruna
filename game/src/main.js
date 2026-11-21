// Twin Lanterns — Spot the Difference: game state and main loop.
// One file, one job: own the state machine (title -> playing -> level
// complete / time out -> game complete), run the timer and the render loop,
// and connect the scene, the markers, the HUD, the input and the sounds.
import {
  SCENE_WIDTH, SCENE_HEIGHT, LEVEL_TIMERS, HINTS_PER_LEVEL,
  POINTS_PER_FIND, HINT_COST, WRONG_CLICK_PENALTY_SECONDS,
  CLICK_RADIUS, TIME_BONUS_PER_SECOND, LEVELS, starsForTimeLeft,
  HINT_PULSE_MS, WRONG_RIPPLE_MS,
} from './config.js';
import { DIFFERENCES, differenceIds, TOTAL_DIFFERENCES } from './differences.js';
import { drawScene } from './scenes.js';
import {
  drawFoundMarker, drawHintPulse, drawWrongRipple,
  showTitleScreen, showLevelComplete, showGameComplete, showTimeOut, hideOverlay,
} from './render.js';
import {
  setLevelName, setCounter, setTimer, setScore, setHintsLeft,
  setMessage, shakePanels,
} from './hud.js';
import {
  eventToSceneCoords, pickDifferenceAt, bindPanelClicks, bindKeyboard,
} from './input.js';
import {
  unlockAudio, playFoundChime, playWrongThud, playHintShimmer,
  playLevelClearFanfare, playTick, playStartJingle, toggleMute,
} from './audio.js';
import { demoStateFor } from './shots.js';

const leftCanvas = document.getElementById('panel-left');
const rightCanvas = document.getElementById('panel-right');
const leftCtx = leftCanvas.getContext('2d');
const rightCtx = rightCanvas.getContext('2d');
leftCanvas.width = SCENE_WIDTH;
leftCanvas.height = SCENE_HEIGHT;
rightCanvas.width = SCENE_WIDTH;
rightCanvas.height = SCENE_HEIGHT;

// The full game state. `screen` is one of: title, playing,
// level-complete, game-complete, time-out.
const state = {
  screen: 'title',
  levelIndex: 0,
  foundIds: new Set(),
  score: 0,
  hintsLeft: HINTS_PER_LEVEL,
  secondsLeft: LEVEL_TIMERS[0],
  lastTickSecond: -1,
  hint: null, // { id, startedAt } while a hint pulse is showing
  wrongRipple: null, // { x, y, startedAt, panel } while it fades
  demo: null, // a frozen ?shot= state, or null in normal play
  totalFound: 0,
  foundPerLevel: [0, 0, 0], // finds counted per level, so a replay re-counts cleanly
};

function levelDifferences() {
  return DIFFERENCES[state.levelIndex + 1];
}

function totalDifferences() {
  return TOTAL_DIFFERENCES;
}

function refreshHud() {
  const total = levelDifferences().length;
  setLevelName(state.levelIndex);
  setCounter(state.foundIds.size, total);
  setTimer(state.secondsLeft);
  setScore(state.score);
  setHintsLeft(state.hintsLeft);
}

function startLevel(levelIndex, keepScore) {
  // A replayed level gives its earlier finds back before recounting them.
  state.totalFound -= state.foundPerLevel[levelIndex];
  state.foundPerLevel[levelIndex] = 0;
  state.levelIndex = levelIndex;
  state.foundIds = new Set();
  state.hintsLeft = HINTS_PER_LEVEL;
  state.secondsLeft = LEVEL_TIMERS[levelIndex];
  state.lastTickSecond = -1;
  state.hint = null;
  state.wrongRipple = null;
  if (!keepScore) state.score = 0;
  state.screen = 'playing';
  hideOverlay();
  refreshHud();
  setMessage(`${LEVELS[levelIndex].name} — find ${levelDifferences().length} differences!`, 'info');
  playStartJingle();
}

function levelComplete() {
  state.screen = 'level-complete';
  const timeLeft = Math.ceil(state.secondsLeft);
  const bonus = timeLeft * TIME_BONUS_PER_SECOND;
  state.score += bonus;
  const stars = starsForTimeLeft(timeLeft, state.levelIndex);
  playLevelClearFanfare();
  refreshHud();
  if (state.levelIndex === LEVELS.length - 1) {
    // The last level's clear screen is the game-complete screen.
    showGameComplete({
      score: state.score,
      totalFound: state.totalFound,
      total: totalDifferences(),
      onReplay: () => {
        state.score = 0;
        state.totalFound = 0;
        state.foundPerLevel = [0, 0, 0];
        startLevel(0, false);
      },
    });
    return;
  }
  showLevelComplete({
    levelName: LEVELS[state.levelIndex].name,
    level: state.levelIndex + 1,
    found: state.foundIds.size,
    total: levelDifferences().length,
    timeLeft,
    score: state.score,
    stars,
    isLast: false,
    onNext: () => startLevel(state.levelIndex + 1, true),
    onReplay: () => startLevel(state.levelIndex, true),
  });
}

function timeOut() {
  state.screen = 'time-out';
  playWrongThud();
  refreshHud();
  showTimeOut({
    found: state.foundIds.size,
    total: levelDifferences().length,
    onRetry: () => startLevel(state.levelIndex, true),
  });
}

function onPanelClick({ x, y, panel }) {
  if (state.screen !== 'playing' || state.demo) return;
  unlockAudio();
  const diff = pickDifferenceAt(levelDifferences(), state.foundIds, x, y, CLICK_RADIUS);
  if (diff) {
    state.foundIds.add(diff.id);
    state.totalFound += 1;
    state.foundPerLevel[state.levelIndex] += 1;
    state.score += POINTS_PER_FIND;
    playFoundChime();
    setMessage(`${diff.label}! +${POINTS_PER_FIND}`, 'good');
    if (state.foundIds.size === levelDifferences().length) {
      refreshHud();
      levelComplete();
      return;
    }
  } else {
    state.secondsLeft = Math.max(0, state.secondsLeft - WRONG_CLICK_PENALTY_SECONDS);
    state.wrongRipple = { x, y, panel, startedAt: performance.now() };
    playWrongThud();
    shakePanels();
    setMessage(`Not quite — ${WRONG_CLICK_PENALTY_SECONDS}s penalty`, 'bad');
  }
  refreshHud();
}

function onHint() {
  if (state.screen !== 'playing' || state.demo) return;
  if (state.hintsLeft <= 0) {
    setMessage('No hints left on this level', 'bad');
    return;
  }
  const remaining = levelDifferences().filter((d) => !state.foundIds.has(d.id));
  if (remaining.length === 0) return;
  const pick = remaining[Math.floor(Math.random() * remaining.length)];
  state.hintsLeft -= 1;
  state.score = Math.max(0, state.score - HINT_COST);
  state.hint = { id: pick.id, startedAt: performance.now() };
  playHintShimmer();
  setMessage(`Hint: look near the ${pick.label.toLowerCase()} (−${HINT_COST})`, 'info');
  refreshHud();
}

function onNext() {
  if (state.screen === 'level-complete' && state.levelIndex < LEVELS.length - 1) {
    startLevel(state.levelIndex + 1, true);
  }
}

function onRestart() {
  if (state.screen === 'playing' || state.screen === 'time-out') {
    startLevel(state.levelIndex, true);
  }
}

function onJump(levelNumber) {
  if (state.screen === 'playing' || state.screen === 'title') {
    startLevel(levelNumber - 1, state.screen !== 'title');
  }
}

function onMute() {
  const muted = toggleMute();
  setMessage(muted ? 'Sound off (M to turn back on)' : 'Sound on', 'info');
}

function onConfirm() {
  if (state.screen === 'title') startLevel(0, false);
}

// ---- rendering -----------------------------------------------------------

function drawPanels(now) {
  const level = state.levelIndex + 1;
  const changed = new Set(differenceIds(level));
  drawScene(leftCtx, level, new Set());
  drawScene(rightCtx, level, changed);
  // Found markers on both panels, numbered in the order they were found.
  const foundList = levelDifferences().filter((d) => state.foundIds.has(d.id));
  foundList.forEach((diff, i) => {
    drawFoundMarker(leftCtx, diff.x, diff.y, diff.r, i + 1);
    drawFoundMarker(rightCtx, diff.x, diff.y, diff.r, i + 1);
  });
  // Hint pulse, if one is showing.
  if (state.hint) {
    const age = now - state.hint.startedAt;
    if (age > HINT_PULSE_MS) {
      state.hint = null;
    } else {
      const diff = levelDifferences().find((d) => d.id === state.hint.id);
      if (diff) {
        drawHintPulse(leftCtx, diff.x, diff.y, diff.r, age);
        drawHintPulse(rightCtx, diff.x, diff.y, diff.r, age);
      }
    }
  }
  // Wrong-click ripple, if one is fading.
  if (state.wrongRipple) {
    const age = now - state.wrongRipple.startedAt;
    if (age > WRONG_RIPPLE_MS) {
      state.wrongRipple = null;
    } else {
      const ctx = state.wrongRipple.panel === 'left' ? leftCtx : rightCtx;
      drawWrongRipple(ctx, state.wrongRipple.x, state.wrongRipple.y, age);
    }
  }
}

// ---- main loop -----------------------------------------------------------

let lastFrame = performance.now();

function frame(now) {
  const dt = Math.min(0.1, (now - lastFrame) / 1000);
  lastFrame = now;
  if (state.screen === 'playing' && !state.demo) {
    state.secondsLeft -= dt;
    const whole = Math.ceil(state.secondsLeft);
    if (whole <= 10 && whole !== state.lastTickSecond && whole > 0) {
      state.lastTickSecond = whole;
      playTick();
    }
    if (state.secondsLeft <= 0) {
      state.secondsLeft = 0;
      setTimer(0);
      timeOut();
    } else {
      setTimer(state.secondsLeft);
    }
  }
  drawPanels(now);
  requestAnimationFrame(frame);
}

// ---- demo (?shot=) states ------------------------------------------------

function applyDemo(demo) {
  state.demo = demo;
  state.levelIndex = demo.level - 1;
  state.foundIds = new Set(demo.foundIds);
  state.secondsLeft = demo.secondsLeft;
  state.score = demo.score || demo.foundIds.length * POINTS_PER_FIND;
  state.hintsLeft = demo.hintId ? HINTS_PER_LEVEL - 1 : HINTS_PER_LEVEL;
  state.screen = demo.screen === 'level-complete' ? 'level-complete' : 'playing';
  if (demo.hintId) state.hint = { id: demo.hintId, startedAt: performance.now() };
  refreshHud();
  if (demo.screen === 'level-complete') {
    showLevelComplete({
      levelName: LEVELS[state.levelIndex].name,
      level: demo.level,
      found: demo.foundIds.length,
      total: levelDifferences().length,
      timeLeft: demo.secondsLeft,
      score: state.score,
      stars: 3,
      isLast: false,
      onNext: () => {},
      onReplay: () => {},
    });
  } else {
    const remain = levelDifferences().length - demo.foundIds.length;
    setMessage(
      demo.hintId
        ? 'Hint: a golden ring shows where to look'
        : `Found ${demo.foundIds.length} / ${levelDifferences().length} — ${remain} remain`,
      'info',
    );
  }
}

// ---- boot ----------------------------------------------------------------

bindPanelClicks(leftCanvas, rightCanvas, onPanelClick);
bindKeyboard({ onHint, onNext, onRestart, onJump, onMute, onConfirm });
document.getElementById('hint-btn').addEventListener('click', () => { unlockAudio(); onHint(); });
document.getElementById('mute-btn').addEventListener('click', onMute);
document.getElementById('restart-btn').addEventListener('click', () => {
  unlockAudio();
  if (state.screen === 'playing') onRestart();
});

const demo = demoStateFor();
if (demo) {
  applyDemo(demo);
} else {
  refreshHud();
  showTitleScreen(() => {
    unlockAudio();
    startLevel(0, false);
  });
}
requestAnimationFrame(frame);

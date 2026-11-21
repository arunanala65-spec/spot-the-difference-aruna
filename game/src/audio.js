// Twin Lanterns — Spot the Difference: synthesized sounds.
// One file, one job: every sound the game makes, built with the Web Audio
// API. No sound files are loaded; each effect is a small oscillator phrase.
let audioContext = null;
let muted = false;

function ensureContext() {
  if (!audioContext) {
    const AC = window.AudioContext || window.webkitAudioContext;
    if (!AC) return null;
    audioContext = new AC();
  }
  if (audioContext.state === 'suspended') audioContext.resume();
  return audioContext;
}

// Unlock audio on the first user gesture; browsers block sound before one.
export function unlockAudio() {
  ensureContext();
}

export function isMuted() {
  return muted;
}

export function toggleMute() {
  muted = !muted;
  return muted;
}

// Play one note: a sine or triangle tone that fades out.
function note(frequency, startAt, duration, type, volume) {
  const ctx = ensureContext();
  if (!ctx || muted) return;
  const osc = ctx.createOscillator();
  const gain = ctx.createGain();
  osc.type = type;
  osc.frequency.value = frequency;
  gain.gain.setValueAtTime(0, ctx.currentTime + startAt);
  gain.gain.linearRampToValueAtTime(volume, ctx.currentTime + startAt + 0.02);
  gain.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + startAt + duration);
  osc.connect(gain);
  gain.connect(ctx.destination);
  osc.start(ctx.currentTime + startAt);
  osc.stop(ctx.currentTime + startAt + duration + 0.05);
}

// A bright two-note chime when a difference is found.
export function playFoundChime() {
  note(880, 0, 0.35, 'sine', 0.22);
  note(1318.5, 0.09, 0.45, 'sine', 0.18);
}

// A soft low thud when the player clicks the wrong spot.
export function playWrongThud() {
  note(160, 0, 0.18, 'triangle', 0.16);
  note(110, 0.05, 0.22, 'triangle', 0.12);
}

// A gentle shimmer when a hint reveals a spot.
export function playHintShimmer() {
  note(1046.5, 0, 0.3, 'sine', 0.12);
  note(1568, 0.08, 0.35, 'sine', 0.1);
  note(2093, 0.16, 0.4, 'sine', 0.08);
}

// A rising arpeggio when a level is cleared.
export function playLevelClearFanfare() {
  const steps = [523.25, 659.25, 783.99, 1046.5];
  steps.forEach((freq, i) => note(freq, i * 0.12, 0.4, 'triangle', 0.18));
}

// A short rising jingle when a level starts.
export function playStartJingle() {
  note(523.25, 0, 0.25, 'triangle', 0.14);
  note(783.99, 0.1, 0.3, 'triangle', 0.14);
}

// A short tick when the timer drops under ten seconds.
export function playTick() {
  note(1200, 0, 0.06, 'sine', 0.08);
}

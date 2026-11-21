// Twin Lanterns — Spot the Difference: difference definitions.
// One file, one job: where every difference hides, per level.
// Coordinates are in scene space (640 x 460). Each entry names the spot
// the player must click, on either panel, and a short label shown after it
// is found. scenes.js reads these ids to draw the right panel differently.
export const DIFFERENCES = {
  1: [
    { id: 'lantern-color', x: 320, y: 84, r: 26, label: 'Lantern changed colour' },
    { id: 'moon-shape', x: 566, y: 56, r: 26, label: 'The moon changed shape' },
    { id: 'missing-star', x: 128, y: 62, r: 18, label: 'A star went missing' },
    { id: 'cat-tail', x: 528, y: 348, r: 24, label: "The cat's tail vanished" },
    { id: 'extra-bowl', x: 252, y: 336, r: 22, label: 'An extra bowl appeared' },
    { id: 'sign-word', x: 320, y: 208, r: 26, label: 'The sign says something else' },
    { id: 'jar-missing', x: 432, y: 244, r: 22, label: 'A jar disappeared' },
  ],
  2: [
    { id: 'awning-stripe', x: 186, y: 138, r: 24, label: 'An awning stripe changed' },
    { id: 'chili-missing', x: 486, y: 176, r: 20, label: 'A chilli fell off the string' },
    { id: 'cart-wheel', x: 96, y: 408, r: 22, label: 'A cart wheel is gone' },
    { id: 'plant-flower', x: 592, y: 388, r: 20, label: 'The flower changed colour' },
    { id: 'orange-missing', x: 356, y: 366, r: 20, label: 'An orange rolled away' },
    { id: 'lantern-extra', x: 64, y: 118, r: 22, label: 'A tiny lantern appeared' },
    { id: 'bowl-steam', x: 214, y: 302, r: 22, label: 'The steam is gone' },
    { id: 'window-light', x: 436, y: 176, r: 22, label: 'A window went dark' },
  ],
  3: [
    { id: 'tiny-star', x: 206, y: 42, r: 14, label: 'A tiny star blinked out' },
    { id: 'lantern-tassel', x: 404, y: 112, r: 16, label: 'A lantern lost its tassel' },
    { id: 'cat-ear', x: 506, y: 296, r: 14, label: "The cat's ear changed" },
    { id: 'sign-dot', x: 366, y: 196, r: 12, label: 'A dot vanished from the sign' },
    { id: 'cobble-shade', x: 152, y: 432, r: 18, label: 'A cobblestone changed shade' },
    { id: 'jar-label', x: 402, y: 250, r: 16, label: 'A jar label changed colour' },
    { id: 'bulb-out', x: 252, y: 62, r: 14, label: 'A string bulb went out' },
    { id: 'spoon-missing', x: 284, y: 322, r: 14, label: 'A spoon disappeared' },
    { id: 'awning-rope', x: 566, y: 146, r: 14, label: 'A rope is missing' },
    { id: 'moon-crater', x: 556, y: 48, r: 12, label: 'A moon crater faded' },
  ],
};

// Look a difference up by level and id.
export function differenceById(level, id) {
  return (DIFFERENCES[level] || []).find((d) => d.id === id) || null;
}

// Every difference id of a level, in order.
export function differenceIds(level) {
  return (DIFFERENCES[level] || []).map((d) => d.id);
}

// How many differences the whole game hides: 7 + 8 + 10 = 25.
export const TOTAL_DIFFERENCES = Object.values(DIFFERENCES)
  .reduce((sum, list) => sum + list.length, 0);

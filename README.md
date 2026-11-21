# spot-the-difference-aruna

[![make.fun · best-spot-the-difference-game-20261121-0451](https://make.fun/badge/best-spot-the-difference-game-20261121-0451.svg)](https://make.fun/bounty/best-spot-the-difference-game-20261121-0451?utm_source=github&utm_medium=readme&utm_campaign=best-spot-the-difference-game-20261121-0451)
[![rank](https://make.fun/badge/best-spot-the-difference-game-20261121-0451/arunanala65-spec/spot-the-difference-aruna/rank.svg)](https://make.fun/bounty/best-spot-the-difference-game-20261121-0451/leaderboard?utm_source=github&utm_medium=readme&utm_campaign=best-spot-the-difference-game-20261121-0451)
[![reward](https://make.fun/badge/best-spot-the-difference-game-20261121-0451/arunanala65-spec/spot-the-difference-aruna/reward.svg)](https://make.fun/bounty/best-spot-the-difference-game-20261121-0451?utm_source=github&utm_medium=readme&utm_campaign=best-spot-the-difference-game-20261121-0451)

**Twin Lanterns — Spot the Difference**: a complete, original spot-the-difference game set at an Indonesian night-market lantern festival. Two near-identical pictures of the same lantern stall sit side by side — one hides 7 to 10 tiny changes. Click a difference on either picture to mark it with a green ring and a chime, and find them all before the lanterns burn down.

## Run it

```sh
node serve.ts
```

Then open http://localhost:8080 in a desktop browser. No build step, no network requests — every script, sound and picture is a file under `game/` or drawn in code.

## How to play

- **Click** a difference on either picture to mark it (+100 points). A wrong click costs 5 seconds and shakes the panels.
- **H** — hint (3 per level, −25 points): a golden ring pulses around a hidden difference.
- **N** — next level, **R** — restart the level, **1 / 2 / 3** — jump to a level, **M** — mute.
- **Timer** counts down per level; clearing a level earns a time bonus and up to 3 stars.

## The game

- **3 levels, 25 differences**: Lantern Row (7), Market Rush (8), Midnight Festival (10) — the differences get smaller and trickier, from a lantern that changed colour to a single missing moon crater.
- **Original art, drawn in code**: the night-market stall — paper lanterns, a striped awning, a satay and bakso sign, an orange tabby cat, a food cart, fireworks — is procedural canvas art in `game/src/scenes.js`. Both panels share one draw function, so the pictures are truly near-identical.
- **Original sounds, synthesized live**: found chimes, hint shimmers and level-clear fanfares from the Web Audio API in `game/src/audio.js` — no sound files.
- **Screenshots are real renders** of the game's own code (`?shot=cover`, `?shot=level2`, `?shot=win`, `?shot=hint` freeze the game into fixed demo states; see `shots.json`).

## Screenshots

| File | What it shows |
| --- | --- |
| `screenshots/1-cover.png` | Level 1 mid-play: 3 differences found with green markers, 4 still hidden, counter "Found 3 / 7 — 4 remain" |
| `screenshots/2-level2.png` | Level 2 mid-play: 5 of 8 found, 3 remain |
| `screenshots/3-complete.png` | Level 1 complete: 7 / 7, three stars, score and time bonus |
| `screenshots/4-hint.png` | A hint pulsing its golden ring on a hidden difference |

## Layout

```
main.ts            Node 22 program that hands the game in (copies game/ +
                   screenshots/ to /output and writes dossier.json)
serve.ts           tiny static server for local play
game/
  index.html       page, HUD and styles
  src/
    config.js      tunables: timers, points, level names
    differences.js where every difference hides, per level
    scenes.js      the procedural night-market art
    render.js      found markers, hint pulse, overlay screens
    hud.js         counter, timer, score, hints
    input.js       mouse clicks and keyboard
    audio.js       synthesized WebAudio sounds
    shots.js       deterministic demo states for screenshots
    main.js        state machine, timer and render loop
screenshots/      3–4 real renders of the game
vendor/
  makefun-game.ts  kit library, unchanged
```

---

<sub>Entered on [make.fun](https://make.fun/?ref=ce51ph37&utm_source=github&utm_medium=readme&utm_campaign=best-spot-the-difference-game-20261121-0451) · AI agents build software for cash rewards</sub>

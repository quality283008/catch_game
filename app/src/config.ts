// Logical resolution. Phaser scales this to the window with Scale.FIT (letterboxed in orange).
export const W = 1280;
export const H = 720;

export const COLORS = {
  bg: 0xfe9539, // page background (orange)
  purple: 0x9062aa, // point box / timer circle
  magenta: 0x990e7a, // buttons
  yellow: 0xf6c072, // hover text / timer pie
  dark: 0x2c2c2c,
} as const;

export const FONT = "'Zen Maru Gothic', sans-serif";

/** Game rules, kept the same as the 2021 version (js/game.js). */
export const RULES = {
  durationSec: 60,
  pointsPerCatch: 10,
  /** Each ice gets a fixed random drop period in this range, once per play. */
  dropPeriodSec: { min: 3, max: 6 },
  /** Ice lanes (fraction of width) — same as the 4 pumpkins. */
  lanes: [0.2, 0.4, 0.6, 0.8],
  /** Ice starts with its top at 18% of the height and falls 1%/20ms = 50% of the height per second. */
  iceStartY: 0.18,
  iceFallPerSec: 0.5,
  /** Cone position in % of width; arrow key / touch moves it 5% per step, clamped to 5–95%. */
  cone: { start: 50, step: 5, min: 5, max: 95 },
} as const;

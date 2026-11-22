# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Overview

ハロウィンアイスキャッチゲーム: a small browser game, made for a 2021 school exhibition site. The player moves a cone left and right to catch falling ice creams over 60 seconds, then can submit the score to a ranking. The UI text is Japanese. The game is designed for **smartphones in landscape** (Safari recommended). It also works on PC with the arrow keys.

The repo holds two versions:
- **`app/`**: the replacement, in progress. Vite + TypeScript + Phaser 3. The target is Cloudflare (Pages, later Workers + D1 for the ranking). The spec is meant to stay as close to the legacy game as possible. It supports PC and smartphone **landscape** only.
- **Repo root**: the legacy 2021 site (HTML, jQuery, PHP, SQLite). Treat it as the reference spec, and don't extend it.

# New app (`app/`)

Run all commands from `app/`:

```bash
npm run dev        # Vite dev server (http://localhost:5173, also on the LAN for phone testing)
npm run build      # tsc --noEmit + vite build → app/dist (static, deployable to Cloudflare Pages)
npm run typecheck
```

There is no test suite or linter yet. `.claude/launch.json` (at the repo root) has an `app` config for the dev server.

## Structure

- Every screen is a Phaser scene in one page (`src/scenes/`): Boot (preload all assets) → Title → Rule → Countdown → Game (the result overlay is inside GameScene) → Entry (name input) → RankingList. Scene keys are in `SCENE` in `src/ui/common.ts`. Move between screens with `goTo()`, which does the white fade-out. Scenes call `fadeIn()` in `create()`.
- The logical resolution is fixed at 1280×720 (`W`/`H` in `src/config.ts`), scaled with `Scale.FIT`. Lay out with fractions of `W`/`H`, ported from the legacy CSS percentages.
- **Game rules** live in `RULES` in `src/config.ts`. They mirror legacy `js/game.js` (60s, +10 per catch, 4 lanes, ice falls 50% of the height per second from 18%, each lane drops on a fixed random period of 3–6s, cone moves in 5% steps clamped to 5–95%). GameScene is driven by frame delta in `update()`, not by `setInterval`. A catch happens when the ice top crosses 5px above the cone top while the horizontal distance is < 100px.
- Input: ←/→ keys (OS key repeat), or tapping the left/right half of the screen (holding repeats). Arrow hints are drawn only on touch devices.
- Portrait on touch devices: the CSS `#rotate-overlay` covers the screen, and `main.ts` calls `game.pause()`/`resume()` through a matching `matchMedia` query.
- Assets are copied into `app/public/assets/` and loaded in BootScene under the short keys from `ALIASES` (`arrow`, `arrow_f`, `ice`; other files keep their names).
- Text uses Zen Maru Gothic from Google Fonts (the legacy Typekit kit is tied to the old domain). `main.ts` waits for the font before creating the game, because Phaser text is drawn to the canvas.
- HTML UI (name input, scrollable ranking panel) uses `this.add.dom()`, styled in `src/style.css`. Phaser forces `display:inline` on the element it receives, so pass it through `domWrap()`. Names are inserted with `escapeHtml`.
- **Ranking storage** sits behind the `RankingRepository` interface (`src/ranking/types.ts`). It currently uses `LocalRankingRepository` (localStorage key `halloween-ice-catch:ranking:v1`, top 100, falls back to memory when storage is unavailable). To move to Workers + D1, add an API-backed implementation and swap it in `src/ranking/index.ts`. Rank = position after sorting by point desc, with earlier entries first on ties (same as `ROW_NUMBER()` in legacy).
- In dev builds, the game instance is exposed as `window.__game`. When the browser tab is hidden, rAF stops, so drive frames with `__game.step(time, delta)` from the console.

# Legacy site (repo root)

## Running locally

PHP needs the `pdo_sqlite` extension. Run the server from the repo root, because the PHP files open `sqlite:user.db` by relative path:

```bash
php -S localhost:8000
```

Open http://localhost:8000/index.html. To inspect the DB:

```bash
sqlite3 user.db "SELECT * FROM t_ranking ORDER BY user_point DESC;"
```

## Page flow

`index.html` → `rule.html` → `count.html` (3-2-1 countdown in `js/count.js`, then a redirect) → `game.html` → POST `hidden_num` → `ranking.php` (enter a name) → POST `user_name` and `user_point` → `insert.php` (INSERT, then a redirect) → `RankingList.php`.

- `RankingList.html` is an older static mock of the ranking page. The live page is `RankingList.php`, which renders the top 3 with crown images (`img/ranking_number{1,2,3}.png`) and everyone else as plain rows, using `ROW_NUMBER() OVER (ORDER BY user_point DESC)`.
- DB schema: `t_ranking(ran_id INTEGER PK AUTOINCREMENT, user_na TEXT, user_point INTEGER)`.

## Deployment URLs are hardcoded

These links point at production hosts, not relative paths. When testing locally, check them before you assume the flow is broken:
- In `game.html`, the `#finish_screen` form posts to an absolute external `.../Halloween/ranking.php` URL. Locally, change it to `ranking.php`.
- In `RankingList.php`, the "play again" and "back to exhibition" links point to the `fes2021.tokyo-ec.net` site.

## Game logic (`js/game.js`)

- All state lives in globals. It runs at script load, with no module or init function.
- There are 4 ice objects (`#ice_1`–`#ice_4`), each handled by its own copy-pasted function `IceHit_1`–`IceHit_4`. Each copy has a 20ms `setInterval` that moves the ice's `top` down 1% per tick from 18%, checks an AABB hit against `#cone`, and resets when hit or when it passes 100%. `RandomTimer_1..4` start each drop every 3–6s (the random period is fixed once per page load). A change to ice behavior has to be made in all four functions.
- A catch gives +10 points (`PointUp`) and briefly flashes `cone_lite.png` and `moon_lite.png`.
- The cone moves only with the keyboard: ←/→ (keyCode 37/39) in 5% steps, clamped to 5–95%. A touch-button handler (`ConeSP`) and gyro code are commented out.
- `Timer()` counts down from 60. Under 10s it adds `.red_time`, and at 5s or less `.finish_time`. At 0 it clears all intervals, shows `#finish_screen` (`.finish_screen_pointer`) and writes the score into the hidden input.

## Shared scripts and CSS

- `js/angle.js`: on narrow screens (≤768px) it shows the `#AngleFrame` overlay in portrait to force landscape. Every game page needs the `#AngleFrame`/`#AngleFrameText` markup and `css/angle.css`.
- `js/loading.js`: intercepts every non-hash `<a>` click, fades out the body (`.fade_out`) and navigates after 500ms. Pages start with `<body class="fade_out">`.
- `js/audio.js`: defines the global `audio()` (plays `#audio_1` / `audio/btn.mp3`), which buttons call via `onclick`. It must load after the `<audio id="audio_1">` element.
- `js/font.js`: Adobe Fonts (Typekit) loader for 筑紫A丸ゴシック.
- `js/NotScroll.js` and `js/game.js` both assign `window.onload`, so whichever loads last wins. Use `addEventListener("load", ...)` for new load handlers.
- `js/height.js` is entirely commented out.
- CSS: every page loads `reset.css` and `style.css` (shared background and moon), then one stylesheet named after the page.

## Known issue

`insert.php` puts `$_POST` values straight into the SQL string, which is an SQL injection risk. `ranking.php` echoes `$_POST["hidden_num"]` without escaping. If you touch these files, switch to prepared statements and `htmlspecialchars`.

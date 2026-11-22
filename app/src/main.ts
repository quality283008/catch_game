import Phaser from 'phaser';
import './style.css';
import { COLORS, FONT, H, W } from './config';
import { BootScene } from './scenes/BootScene';
import { CountdownScene } from './scenes/CountdownScene';
import { EntryScene } from './scenes/EntryScene';
import { GameScene } from './scenes/GameScene';
import { RankingListScene } from './scenes/RankingListScene';
import { RuleScene } from './scenes/RuleScene';
import { TitleScene } from './scenes/TitleScene';

async function waitForFont(): Promise<void> {
  // Phaser draws text to canvas, so the web font must be ready first (give up after 3s, like the old Typekit loader).
  const family = FONT.split(',')[0];
  await Promise.race([
    Promise.all([document.fonts.load(`700 32px ${family}`), document.fonts.load(`500 32px ${family}`)]),
    new Promise((r) => setTimeout(r, 3000)),
  ]).catch(() => undefined);
}

function start(): void {
  const game = new Phaser.Game({
    type: Phaser.AUTO,
    parent: 'game',
    width: W,
    height: H,
    backgroundColor: COLORS.bg,
    dom: { createContainer: true },
    scale: { mode: Phaser.Scale.FIT, autoCenter: Phaser.Scale.CENTER_BOTH },
    input: { activePointers: 2 },
    scene: [BootScene, TitleScene, RuleScene, CountdownScene, GameScene, EntryScene, RankingListScene],
  });

  // Pause everything while a phone is held in portrait (the CSS overlay asks the player to rotate).
  const portrait = window.matchMedia('(orientation: portrait) and (pointer: coarse)');
  const syncOrientation = () => (portrait.matches ? game.pause() : game.resume());
  portrait.addEventListener('change', syncOrientation);
  game.events.once(Phaser.Core.Events.READY, syncOrientation);

  // Handy for debugging in the dev console: `__game.scene.getScenes(true)`.
  if (import.meta.env.DEV) (window as unknown as { __game: Phaser.Game }).__game = game;
}

void waitForFont().then(start);

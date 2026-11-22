import Phaser from 'phaser';
import { COLORS, FONT, H, W } from '../config';

export const SCENE = {
  boot: 'Boot',
  title: 'Title',
  rule: 'Rule',
  countdown: 'Countdown',
  game: 'Game',
  entry: 'Entry',
  rankingList: 'RankingList',
} as const;

export function playClick(scene: Phaser.Scene): void {
  scene.sound.play('btn');
}

/** White fade between screens, like the old loading.js (0.5s). */
export function goTo(scene: Phaser.Scene, key: string, data?: object): void {
  if (scene.registry.get('transitioning')) return;
  scene.registry.set('transitioning', true);
  scene.cameras.main.fadeOut(500, 255, 255, 255);
  scene.cameras.main.once(Phaser.Cameras.Scene2D.Events.FADE_OUT_COMPLETE, () => {
    scene.registry.set('transitioning', false);
    scene.scene.start(key, data);
  });
}

export function fadeIn(scene: Phaser.Scene): void {
  scene.cameras.main.fadeIn(400, 255, 255, 255);
}

/** Orange sky, Halloween town at the bottom, moon at the top right. Returns the moon so the game can flash it. */
export function addBackground(scene: Phaser.Scene): Phaser.GameObjects.Image {
  scene.cameras.main.setBackgroundColor(COLORS.bg);
  const moon = scene.add.image(W * 0.95, H * 0.1, 'moon').setOrigin(1, 0).setDisplaySize(400, 400);
  const back = scene.add.image(W / 2, H, 'back').setOrigin(0.5, 1);
  back.setScale(W / back.width);
  return moon;
}

export function text(
  scene: Phaser.Scene,
  x: number,
  y: number,
  value: string,
  size: number,
  color = '#ffffff',
  style: Phaser.Types.GameObjects.Text.TextStyle = {},
): Phaser.GameObjects.Text {
  return scene.add
    .text(x, y, value, {
      fontFamily: FONT,
      fontSize: `${size}px`,
      fontStyle: '700',
      color,
      align: 'center',
      lineSpacing: size * 0.5,
      ...style,
    })
    .setOrigin(0.5)
    .setLetterSpacing(size * 0.1);
}

/**
 * Pill button in the old .rule_link / .link_btn style: magenta, black drop shadow,
 * arrow icon on the right that turns on hover. Plays the click sound.
 */
export function button(
  scene: Phaser.Scene,
  x: number,
  y: number,
  label: string,
  onClick: () => void,
  opts: { size?: number; width?: number; icon?: string } = {},
): Phaser.GameObjects.Container {
  const size = opts.size ?? 30;
  const labelText = text(scene, 0, 0, label, size);
  const padX = 40;
  const iconSize = size * 0.75;
  const width = opts.width ?? labelText.width + padX * 2 + iconSize + 20;
  const height = size + 28;

  const shadow = scene.add.graphics().fillStyle(0x000000, 0.85).fillRoundedRect(-width / 2 + 3, -height / 2 + 3, width, height, 25);
  const body = scene.add.container(0, 0);
  const bg = scene.add.graphics().fillStyle(COLORS.magenta).fillRoundedRect(-width / 2, -height / 2, width, height, 25);
  const arrow = scene.add.image(width / 2 - padX * 0.6 - iconSize / 2, 0, 'arrow').setDisplaySize(iconSize, iconSize);
  labelText.setX(opts.icon ? iconSize / 2 : -iconSize / 4);
  body.add([bg, labelText, arrow]);
  if (opts.icon) {
    body.add(scene.add.image(-width / 2 + padX * 0.6 + iconSize / 2, 0, opts.icon).setDisplaySize(iconSize, iconSize));
  }

  const c = scene.add.container(x, y, [shadow, body]).setSize(width, height);
  c.setInteractive({ useHandCursor: true });
  const setHover = (on: boolean) => {
    body.setPosition(on ? 3 : 0, on ? 3 : 0);
    shadow.setVisible(!on);
    labelText.setColor(on ? '#f6c072' : '#ffffff');
    arrow.setTexture(on ? 'arrow_f' : 'arrow').setAngle(on ? 90 : 0).setDisplaySize(iconSize, iconSize);
  };
  c.on('pointerover', () => setHover(true));
  c.on('pointerout', () => setHover(false));
  c.on('pointerup', () => {
    playClick(scene);
    onClick();
  });
  return c;
}

/** Swaying pumpkin (rotate 0 → 35deg and back). */
export function pumpkin(scene: Phaser.Scene, x: number, y: number, width: number, periodMs: number): Phaser.GameObjects.Image {
  const img = scene.add.image(x, y, 'pumpkin');
  img.setScale(width / img.width);
  scene.tweens.add({ targets: img, angle: 35, duration: periodMs / 2, yoyo: true, repeat: -1, ease: 'Linear' });
  return img;
}

/**
 * Phaser forces `display: inline` on the element passed to add.dom(), which breaks flex layouts.
 * Wrap the real element so its own CSS is kept.
 */
export function domWrap(el: HTMLElement): HTMLDivElement {
  const wrap = document.createElement('div');
  wrap.appendChild(el);
  return wrap;
}

import Phaser from 'phaser';
import { COLORS, H, W } from '../config';
import { SCENE } from '../ui/common';

const IMAGES = [
  'arrow_img', 'arrow_img_f', 'back', 'bone', 'cone', 'cone_lite', 'finish_text', 'ice_obj1', 'image1',
  'index_text', 'moon', 'moon_lite', 'pumpkin', 'ranking_img', 'return_game', 'ranking_number1',
  'ranking_number2', 'ranking_number3', 'ranking_text_img', 'rule_text',
];
const ALIASES: Record<string, string> = { arrow_img: 'arrow', arrow_img_f: 'arrow_f', ice_obj1: 'ice' };

/** Preloads every asset once, so later screens never wait (the old site re-fetched on each page). */
export class BootScene extends Phaser.Scene {
  constructor() {
    super(SCENE.boot);
  }

  preload(): void {
    this.cameras.main.setBackgroundColor(COLORS.bg);
    const bar = this.add.rectangle(W / 2 - 200, H / 2, 0, 12, 0xffffff).setOrigin(0, 0.5);
    this.add.rectangle(W / 2, H / 2, 400, 12).setStrokeStyle(2, 0xffffff);
    this.load.on('progress', (v: number) => (bar.width = 400 * v));

    this.load.setPath('assets/');
    for (const name of IMAGES) this.load.image(ALIASES[name] ?? name, `img/${name}.png`);
    this.load.audio('btn', 'audio/btn.mp3');
  }

  create(): void {
    this.scene.start(SCENE.title);
  }
}

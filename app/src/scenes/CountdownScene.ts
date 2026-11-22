import Phaser from 'phaser';
import { H, W } from '../config';
import { addBackground, fadeIn, pumpkin, SCENE, text } from '../ui/common';

/** 3, 2, 1 then the game starts (no fade, like the old count.html redirect). */
export class CountdownScene extends Phaser.Scene {
  constructor() {
    super(SCENE.countdown);
  }

  create(): void {
    addBackground(this);
    for (const [x, y] of [
      [0.3, 0.3],
      [0.7, 0.3],
      [0.3, 0.7],
      [0.7, 0.7],
    ]) {
      pumpkin(this, W * x, H * y, 80, 1000);
    }

    const count = text(this, W / 2, H / 2, '3', 200);
    let n = 3;
    this.time.addEvent({
      delay: 1000,
      repeat: 2,
      callback: () => {
        n -= 1;
        if (n > 0) count.setText(String(n));
        else this.scene.start(SCENE.game);
      },
    });

    fadeIn(this);
  }
}

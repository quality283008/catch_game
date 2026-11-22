import Phaser from 'phaser';
import { H, W } from '../config';
import { addBackground, button, fadeIn, goTo, SCENE, text } from '../ui/common';

export class TitleScene extends Phaser.Scene {
  constructor() {
    super(SCENE.title);
  }

  create(): void {
    addBackground(this);

    // Skeleton with a scythe, bouncing at the bottom left.
    const bone = this.add.image(W * 0.05, H * 0.9, 'bone').setOrigin(0, 1);
    bone.setScale(360 / bone.width);
    const s = bone.scale;
    this.tweens.chain({
      targets: bone,
      loop: -1,
      tweens: [
        { scaleX: s * 0.9, scaleY: s * 0.9, angle: 7, duration: 400 },
        { scaleX: s * 1.1, scaleY: s * 0.9, angle: 0, duration: 400 },
        { scaleX: s * 0.9, scaleY: s * 1.1, angle: 0, duration: 400 },
        { scaleX: s * 1.1, scaleY: s * 0.9, angle: -7, duration: 400 },
        { scaleX: s, scaleY: s, angle: 0, duration: 400 },
      ],
    });

    const title = this.add.image(W / 2, H * 0.1, 'index_text').setOrigin(0.5, 0);
    title.setScale((W * 0.4) / title.width);
    text(this, W / 2, H * 0.58, 'コーンとアイスを合体させて\nアイスクリームを作ろう', 28);
    button(this, W / 2, H * 0.78, 'はじめる', () => goTo(this, SCENE.rule));

    fadeIn(this);
  }
}

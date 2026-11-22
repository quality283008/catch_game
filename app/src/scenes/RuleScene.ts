import Phaser from 'phaser';
import { H, W } from '../config';
import { addBackground, button, fadeIn, goTo, SCENE, text } from '../ui/common';

export class RuleScene extends Phaser.Scene {
  constructor() {
    super(SCENE.rule);
  }

  create(): void {
    addBackground(this);

    const title = this.add.image(W / 2, H * 0.1, 'rule_text').setOrigin(0.5, 0);
    title.setScale((W * 0.3) / title.width);

    const touch = this.sys.game.device.input.touch;
    const how = touch ? '画面の左右をタップしてコーンを動かそう' : '← → キーでコーンを動かそう';
    text(
      this,
      W / 2,
      H * 0.54,
      `降ってくるアイスをキャッチすると\n10ポイントゲットです。\n総ポイントはランキングに載るので\nみんなで競い合いましょう。\n${how}`,
      24,
    );
    button(this, W / 2, H * 0.82, 'スタート', () => goTo(this, SCENE.countdown));

    fadeIn(this);
  }
}

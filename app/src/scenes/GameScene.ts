import Phaser from 'phaser';
import { COLORS, H, RULES, W } from '../config';
import { addBackground, button, goTo, playClick, pumpkin, SCENE, text } from '../ui/common';

const ICE_SIZE = 100;
const CONE_W = 150;
/** Horizontal catch distance between cone and ice centers (old code: Cone_w/2 + Ice_w/2 = 50 + 50). */
const CATCH_DX = 100;
const TIMER_R = 60;

interface Ice {
  img: Phaser.GameObjects.Image;
  falling: boolean;
}

export class GameScene extends Phaser.Scene {
  private point = 0;
  private elapsedMs = 0;
  private shownSec = 0;
  private conePos: number = RULES.cone.start;
  private ended = false;

  private ices: Ice[] = [];
  private cone!: Phaser.GameObjects.Image;
  private moon!: Phaser.GameObjects.Image;
  private pointBox!: Phaser.GameObjects.Graphics;
  private pointText!: Phaser.GameObjects.Text;
  private timerPie!: Phaser.GameObjects.Graphics;
  private timerText!: Phaser.GameObjects.Text;
  private timerPulse?: Phaser.Tweens.Tween;
  private pulseScale = 1;
  private holdTimer?: Phaser.Time.TimerEvent;

  constructor() {
    super(SCENE.game);
  }

  create(): void {
    this.point = 0;
    this.elapsedMs = 0;
    this.shownSec = RULES.durationSec;
    this.conePos = RULES.cone.start;
    this.ended = false;
    this.ices = [];
    this.timerPulse = undefined;
    this.pulseScale = 1;

    this.moon = addBackground(this);

    // Ice comes out from behind each pumpkin and falls in its lane.
    RULES.lanes.forEach((lane) => {
      const img = this.add.image(W * lane, H * RULES.iceStartY, 'ice').setOrigin(0.5, 0).setDisplaySize(ICE_SIZE, ICE_SIZE);
      img.setVisible(false).setDepth(1);
      const ice: Ice = { img, falling: false };
      this.ices.push(ice);
      pumpkin(this, W * lane, H * 0.15 + 73, 150, 3000).setDepth(2);

      const periodMs = Phaser.Math.FloatBetween(RULES.dropPeriodSec.min, RULES.dropPeriodSec.max) * 1000;
      this.time.addEvent({ delay: periodMs, loop: true, callback: () => this.drop(ice) });
    });

    this.cone = this.add.image(0, H * 1.05, 'cone').setOrigin(0.5, 1).setDepth(3);
    this.cone.setScale(CONE_W / this.cone.width);
    this.moveCone(0);

    this.createHud();
    this.setupInput();
  }

  update(_time: number, delta: number): void {
    if (this.ended) return;

    this.elapsedMs += delta;
    const remainingMs = Math.max(0, RULES.durationSec * 1000 - this.elapsedMs);
    this.drawTimer(remainingMs / (RULES.durationSec * 1000));
    const sec = Math.ceil(remainingMs / 1000);
    if (sec !== this.shownSec) this.onSecond(sec);
    if (remainingMs <= 0) {
      this.finish();
      return;
    }

    const fall = H * RULES.iceFallPerSec * (delta / 1000);
    const catchLine = this.cone.y - this.cone.displayHeight - 5;
    for (const ice of this.ices) {
      if (!ice.falling) continue;
      const prev = ice.img.y;
      ice.img.y += fall;
      if (prev < catchLine && ice.img.y >= catchLine && Math.abs(this.cone.x - ice.img.x) < CATCH_DX) {
        this.resetIce(ice);
        this.onCatch();
      } else if (ice.img.y > H) {
        this.resetIce(ice);
      }
    }
  }

  // ---------------------------------------------------------------- ice

  private drop(ice: Ice): void {
    // The old code started a second interval if the timer fired mid-fall (the ice sped up); here we skip it.
    if (this.ended || ice.falling) return;
    ice.falling = true;
    ice.img.setY(H * RULES.iceStartY).setVisible(true);
  }

  private resetIce(ice: Ice): void {
    ice.falling = false;
    ice.img.setVisible(false).setY(H * RULES.iceStartY);
  }

  private onCatch(): void {
    this.point += RULES.pointsPerCatch;
    this.pointText.setText(`${this.point}pt`);
    this.layoutPointBox();
    this.flash(this.cone, 'cone', 'cone_lite');
    this.flash(this.moon, 'moon', 'moon_lite');
  }

  private flash(img: Phaser.GameObjects.Image, normal: string, lit: string): void {
    img.setTexture(lit);
    this.time.delayedCall(400, () => img.setTexture(normal));
  }

  // ---------------------------------------------------------------- cone / input

  private moveCone(dir: -1 | 0 | 1): void {
    if (this.ended) return;
    const { step, min, max } = RULES.cone;
    if (dir !== 0) playClick(this); // the old game played the button sound on every move
    this.conePos = Phaser.Math.Clamp(this.conePos + dir * step, min, max);
    this.cone.x = (W * this.conePos) / 100;
  }

  private setupInput(): void {
    const kb = this.input.keyboard;
    if (kb) {
      kb.addCapture('LEFT,RIGHT');
      // keydown repeats while held (OS key repeat), same as the old keydown handler.
      kb.on('keydown-LEFT', () => this.moveCone(-1));
      kb.on('keydown-RIGHT', () => this.moveCone(1));
    }

    // Touch / click: left half moves left, right half moves right; holding repeats.
    const stopHold = () => {
      this.holdTimer?.remove();
      this.holdTimer = undefined;
    };
    this.input.on('pointerdown', (p: Phaser.Input.Pointer) => {
      const dir = p.x < W / 2 ? -1 : 1;
      stopHold();
      this.moveCone(dir);
      this.holdTimer = this.time.addEvent({
        delay: 300,
        callback: () => {
          this.holdTimer = this.time.addEvent({ delay: 110, loop: true, callback: () => this.moveCone(dir) });
        },
      });
    });
    this.input.on('pointerup', stopHold);
    this.input.on('gameout', stopHold);
    this.events.once(Phaser.Scenes.Events.SHUTDOWN, stopHold);

    if (this.sys.game.device.input.touch) {
      this.addTouchHint(W * 0.05 + 40, -1);
      this.addTouchHint(W * 0.95 - 40, 1);
    }
  }

  /** The purple arrow buttons from the old mobile design (the whole half of the screen reacts, not just the button). */
  private addTouchHint(x: number, dir: -1 | 1): void {
    const y = H * 0.95 - 40;
    this.add.rectangle(x, y, 80, 80, COLORS.purple).setDepth(4).setAlpha(0.85);
    this.add.image(x, y, 'arrow').setDisplaySize(36, 36).setAngle(dir < 0 ? 180 : 0).setDepth(4);
  }

  // ---------------------------------------------------------------- HUD

  private createHud(): void {
    this.pointBox = this.add.graphics().setDepth(10);
    this.pointText = text(this, 0, H * 0.05 + 38, '0pt', 40).setOrigin(1, 0.5).setDepth(11);
    this.layoutPointBox();

    const cx = W * 0.05 + TIMER_R;
    const cy = H * 0.05 + TIMER_R;
    this.timerPie = this.add.graphics({ x: cx, y: cy }).setDepth(10);
    this.timerText = text(this, cx, cy, String(RULES.durationSec), 40).setDepth(11);
    this.drawTimer(1);
  }

  private layoutPointBox(): void {
    const right = W * 0.95;
    const padX = 18;
    const w = this.pointText.width + padX * 2;
    const h = 76;
    this.pointText.setX(right - padX);
    this.pointBox
      .clear()
      .fillStyle(COLORS.purple)
      .fillRoundedRect(right - w, H * 0.05, w, h, 8)
      .lineStyle(3, 0xffffff)
      .strokeRoundedRect(right - w, H * 0.05, w, h, 8);
  }

  /** Purple circle with a yellow slice for the remaining time (replaces the old CSS conic animation). */
  private drawTimer(remaining: number): void {
    const g = this.timerPie.clear().fillStyle(COLORS.purple).fillCircle(0, 0, TIMER_R);
    if (remaining > 0) {
      const start = -Math.PI / 2;
      g.fillStyle(COLORS.yellow).slice(0, 0, TIMER_R, start, start + Math.PI * 2 * remaining, false).fillPath();
    }
    g.lineStyle(3, 0xffffff).strokeCircle(0, 0, TIMER_R);
  }

  private onSecond(sec: number): void {
    this.shownSec = sec;
    this.timerText.setText(String(sec));
    if (sec < 10 && sec > 0) {
      this.timerText.setColor('#fe9539');
      const scale = sec <= 5 ? 1.5 : 1.25; // old .finish_time / .red_time
      if (this.pulseScale !== scale) {
        this.pulseScale = scale;
        this.timerPulse?.remove();
        this.timerText.setScale(1);
        this.timerPulse = this.tweens.add({ targets: this.timerText, scale, duration: 500, yoyo: true, repeat: -1, ease: 'Sine.easeInOut' });
      }
    }
  }

  // ---------------------------------------------------------------- finish

  private finish(): void {
    this.ended = true;
    this.time.removeAllEvents();
    this.timerPulse?.remove();
    this.timerText.setText('0').setScale(1).setColor('#ffffff');
    this.drawTimer(0);
    this.ices.forEach((ice) => this.resetIce(ice));
    this.cone.setTexture('cone');
    this.moon.setTexture('moon');
    this.input.removeAllListeners();

    const overlay = this.add.container(0, 0).setDepth(20).setAlpha(0);
    overlay.add(this.add.rectangle(0, 0, W, H, 0x000000, 0.6).setOrigin(0).setInteractive());

    const title = this.add.image(W / 2 + W * 0.024, H * 0.08, 'finish_text').setOrigin(0.5, 0);
    title.setScale((W * 0.4) / title.width);
    overlay.add(title);
    overlay.add(scoreLine(this, H * 0.5, 'あなたの合計ポイントは', String(this.point), 'ポイントです。', '#fe9539'));

    const width = W * 0.4;
    overlay.add(button(this, W / 2, H * 0.66, 'もう一度ゲームで遊ぶ', () => goTo(this, SCENE.countdown), { width, icon: 'return_game' }));
    overlay.add(
      button(this, W / 2, H * 0.82, 'ランキングに登録する', () => goTo(this, SCENE.entry, { point: this.point }), {
        width,
        icon: 'ranking_img',
      }),
    );

    this.tweens.add({ targets: overlay, alpha: 1, duration: 500 });
  }
}

/** "label [value] suffix" on one centered line, with the value colored and underlined. */
export function scoreLine(
  scene: Phaser.Scene,
  y: number,
  before: string,
  value: string,
  after: string,
  valueColor: string,
  size = 40,
): Phaser.GameObjects.Container {
  const a = text(scene, 0, 0, before, size).setOrigin(0, 0.5);
  const v = text(scene, 0, 0, value, size, valueColor).setOrigin(0, 0.5);
  const b = text(scene, 0, 0, after, size).setOrigin(0, 0.5);
  const gap = size * 0.3;
  const total = a.width + gap + v.width + gap + b.width;
  a.setX(-total / 2);
  v.setX(a.x + a.width + gap);
  b.setX(v.x + v.width + gap);
  const color = Phaser.Display.Color.HexStringToColor(valueColor).color;
  const underline = scene.add.rectangle(v.x, size * 0.6, v.width, 3, color).setOrigin(0, 0.5);
  return scene.add.container(scene.scale.width / 2, y, [a, v, b, underline]);
}

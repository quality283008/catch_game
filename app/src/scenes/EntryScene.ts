import Phaser from 'phaser';
import { H, W } from '../config';
import { NAME_MAX_LENGTH, normalizeName, ranking } from '../ranking';
import { addBackground, button, domWrap, fadeIn, goTo, playClick, SCENE } from '../ui/common';
import { scoreLine } from './GameScene';

/** Name entry after a game (old ranking.php + insert.php). */
export class EntryScene extends Phaser.Scene {
  private point = 0;
  private submitting = false;

  constructor() {
    super(SCENE.entry);
  }

  init(data: { point?: number }): void {
    this.point = data.point ?? 0;
    this.submitting = false;
  }

  create(): void {
    addBackground(this);

    const title = this.add.image(W / 2, H * 0.08, 'ranking_text_img').setOrigin(0.5, 0);
    title.setScale((W * 0.4) / title.width);
    scoreLine(this, H * 0.42, 'あなたの獲得したポイントは', String(this.point), 'ポイントです', '#990e7a', 32);

    const form = document.createElement('form');
    form.className = 'entry-form';
    form.style.position = 'relative';
    form.innerHTML = `
      <input type="text" name="name" placeholder="名前を入力する" maxlength="${NAME_MAX_LENGTH}" autocomplete="nickname" enterkeyhint="done" />
      <button type="submit">ランキングに登録する</button>
      <p class="error" hidden></p>`;
    const input = form.querySelector('input')!;
    const error = form.querySelector<HTMLParagraphElement>('.error')!;
    form.addEventListener('submit', (e) => {
      e.preventDefault();
      playClick(this);
      const name = normalizeName(input.value);
      if (!name) {
        error.textContent = '名前を入力してください';
        error.hidden = false;
        input.focus();
        return;
      }
      void this.submit(name);
    });
    // Keep Phaser from treating typing as game input.
    form.addEventListener('keydown', (e) => e.stopPropagation());
    this.add.dom(W / 2, H * 0.6, domWrap(form));

    button(this, W / 2, H * 0.82, '登録しないでランキングを見る', () => goTo(this, SCENE.rankingList));

    fadeIn(this);
  }

  private async submit(name: string): Promise<void> {
    if (this.submitting) return;
    this.submitting = true;
    const entry = await ranking.add(name, this.point);
    (document.activeElement as HTMLElement | null)?.blur();
    goTo(this, SCENE.rankingList, { highlightId: entry.id });
  }
}

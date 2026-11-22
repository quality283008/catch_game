import Phaser from 'phaser';
import { COLORS, H, W } from '../config';
import { ranking, type RankingEntry } from '../ranking';
import { domWrap, fadeIn, goTo, playClick, SCENE } from '../ui/common';

function escapeHtml(s: string): string {
  return s.replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[c]!);
}

function rowHtml(e: RankingEntry, rank: number, highlightId?: string): string {
  const top3 = rank <= 3;
  const rankCell = top3 ? `<img src="assets/img/ranking_number${rank}.png" alt="${rank}位" />` : `${rank}位`;
  const cls = ['ranking-row', top3 ? 'top3' : '', e.id === highlightId ? 'mine' : ''].join(' ');
  return `<div class="${cls}" data-id="${e.id}"><div class="rank">${rankCell}</div><div class="name">${escapeHtml(e.name)}</div><div class="point">${e.point}ポイント</div></div>`;
}

/** Ranking list (old RankingList.php). Rank = position after sorting by point desc, like ROW_NUMBER(). */
export class RankingListScene extends Phaser.Scene {
  private highlightId?: string;
  private bg?: Phaser.GameObjects.TileSprite;

  constructor() {
    super(SCENE.rankingList);
  }

  init(data: { highlightId?: string }): void {
    this.highlightId = data.highlightId;
  }

  create(): void {
    this.cameras.main.setBackgroundColor(COLORS.bg);
    // Tiled background drifting diagonally (old BackAnime, 2000px per 80s).
    this.bg = this.add.tileSprite(0, 0, W, H, 'image1').setOrigin(0);

    // Orange wavy header behind the title (old SVG header).
    const header = this.add.graphics().fillStyle(COLORS.bg).fillRect(0, 0, W, 110);
    for (let x = 0; x <= W; x += 80) header.fillEllipse(x + 40, 110, 96, 36);

    const title = this.add.image(W / 2, 8, 'ranking_text_img').setOrigin(0.5, 0);
    title.setScale((W * 0.35) / title.width);

    const panel = document.createElement('div');
    panel.className = 'ranking-panel';
    panel.innerHTML = `<div class="ranking-row header"><div class="rank">RANK</div><div class="name">NAME</div><div class="point">POINT</div></div><div class="ranking-body"><p class="ranking-empty">読み込み中…</p></div>`;
    // Let the panel scroll with wheel / touch instead of Phaser swallowing it.
    panel.addEventListener('wheel', (e) => e.stopPropagation(), { passive: true });
    this.add.dom(W / 2, 150, panel).setOrigin(0.5, 0);

    const actions = document.createElement('div');
    actions.className = 'ranking-actions';
    actions.innerHTML = `<button type="button" data-to="${SCENE.countdown}">もう一度ゲームをする</button><button type="button" data-to="${SCENE.title}">タイトルに戻る</button>`;
    actions.addEventListener('click', (e) => {
      const to = (e.target as HTMLElement).closest('button')?.dataset.to;
      if (!to) return;
      playClick(this);
      goTo(this, to);
    });
    this.add.dom(W / 2, H - 50, domWrap(actions));

    void this.render(panel.querySelector('.ranking-body')!);
    fadeIn(this);
  }

  update(_t: number, delta: number): void {
    if (!this.bg) return;
    const d = (2000 / 80) * (delta / 1000);
    this.bg.tilePositionX -= d;
    this.bg.tilePositionY -= d;
  }

  private async render(body: HTMLElement): Promise<void> {
    const entries = await ranking.list();
    if (!this.scene.isActive()) return;
    body.innerHTML = entries.length
      ? entries.map((e, i) => rowHtml(e, i + 1, this.highlightId)).join('')
      : '<p class="ranking-empty">まだ登録がありません</p>';
    body.querySelector('.mine')?.scrollIntoView({ block: 'center' });
  }
}

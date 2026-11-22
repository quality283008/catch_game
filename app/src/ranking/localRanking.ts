import { normalizeName, type RankingEntry, type RankingRepository } from './types';

const KEY = 'halloween-ice-catch:ranking:v1';
const MAX_ENTRIES = 100;

function sortEntries(entries: RankingEntry[]): RankingEntry[] {
  return [...entries].sort((a, b) => b.point - a.point || a.createdAt - b.createdAt);
}

function isEntry(v: unknown): v is RankingEntry {
  const e = v as RankingEntry;
  return !!e && typeof e.id === 'string' && typeof e.name === 'string' && Number.isFinite(e.point) && Number.isFinite(e.createdAt);
}

/** Ranking kept in this browser only. Storage can be unavailable (private mode etc.), so it falls back to memory. */
export class LocalRankingRepository implements RankingRepository {
  private memory: RankingEntry[] = [];

  private read(): RankingEntry[] {
    try {
      const raw = localStorage.getItem(KEY);
      if (!raw) return this.memory;
      const parsed: unknown = JSON.parse(raw);
      return Array.isArray(parsed) ? parsed.filter(isEntry) : this.memory;
    } catch {
      return this.memory;
    }
  }

  private write(entries: RankingEntry[]): void {
    this.memory = entries;
    try {
      localStorage.setItem(KEY, JSON.stringify(entries));
    } catch {
      // keep the in-memory copy only
    }
  }

  async list(): Promise<RankingEntry[]> {
    return sortEntries(this.read());
  }

  async add(name: string, point: number): Promise<RankingEntry> {
    const entry: RankingEntry = {
      id: crypto.randomUUID?.() ?? `${Date.now()}-${Math.random().toString(36).slice(2)}`,
      name: normalizeName(name),
      point: Math.max(0, Math.floor(point)),
      createdAt: Date.now(),
    };
    this.write(sortEntries([...this.read(), entry]).slice(0, MAX_ENTRIES));
    return entry;
  }
}

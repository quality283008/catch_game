export interface RankingEntry {
  id: string;
  name: string;
  point: number;
  createdAt: number;
}

/**
 * Storage for the ranking. Today it is localStorage (LocalRankingRepository);
 * later a Cloudflare Workers + D1 implementation can replace it without touching the scenes.
 */
export interface RankingRepository {
  /** Entries sorted by point desc (ties: earlier first). */
  list(): Promise<RankingEntry[]>;
  add(name: string, point: number): Promise<RankingEntry>;
}

export const NAME_MAX_LENGTH = 12;

export function normalizeName(raw: string): string {
  return raw.replace(/\s+/g, ' ').trim().slice(0, NAME_MAX_LENGTH);
}

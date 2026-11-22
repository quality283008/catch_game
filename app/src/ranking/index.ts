import { LocalRankingRepository } from './localRanking';
import type { RankingRepository } from './types';

export const ranking: RankingRepository = new LocalRankingRepository();
export * from './types';

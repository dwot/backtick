import type { BlockFeedback } from './compare';

export interface Row {
  blocks: BlockFeedback[];
  extra: number;
}

/** An in-progress run at a level. Cleared when the level is completed. */
export interface Attempt {
  rows: Row[];
  /** Turning on the live preview caps the level at one star. */
  peeked: boolean;
  draft: string;
}

export interface State {
  /** Best stars earned per level id (absent = not completed). */
  stars: Record<string, number>;
  attempts: Record<string, Attempt>;
}

/** Checks you can use and still earn three stars. */
export const FREE_CHECKS = 2;

export function starsFor(attempt: Attempt): number {
  if (attempt.peeked) return 1;
  return attempt.rows.length <= FREE_CHECKS ? 3 : 2;
}

const KEY = 'backtick:v2';

export function loadState(): State {
  try {
    const raw = localStorage.getItem(KEY);
    if (raw) return { stars: {}, attempts: {}, ...JSON.parse(raw) };
  } catch {
    // private mode or corrupt data: start fresh
  }
  return { stars: {}, attempts: {} };
}

export function saveState(state: State): void {
  try {
    localStorage.setItem(KEY, JSON.stringify(state));
  } catch {
    // storage unavailable: progress just won't persist
  }
}

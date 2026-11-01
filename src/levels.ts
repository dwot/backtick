export type LevelKind = 'lesson' | 'boss' | 'fix';

export interface Level {
  id: string;
  chapter: number;
  order: number;
  kind: LevelKind;
  title: string;
  skills: string[];
  target: string;
  /** Initial editor contents; the broken doc for fix levels. */
  starter: string;
  /** Syntax card shown beside the target, before you start (lessons and fix levels). */
  card: string;
  /** Markdown for the "Learned" card shown after completing the level. */
  learn: string;
  /** Cheat sheet entry this level adds once completed (lessons and fix levels). */
  sheet: string;
  /** Optional one-line note shown under the cheat sheet entry. */
  tip: string;
}

export interface Chapter {
  n: number;
  title: string;
  blurb: string;
}

export const chapters: Chapter[] = [
  { n: 1, title: 'Text', blurb: 'Paragraphs, headings, emphasis and inline code.' },
  { n: 2, title: 'Lists', blurb: 'Bullets, numbers, nesting and task lists.' },
  { n: 3, title: 'Links & images', blurb: 'Inline links, autolinks, images and reference links.' },
  { n: 4, title: 'Code', blurb: 'Fences, languages, code inside lists, backticks inside code.' },
  { n: 5, title: 'Quotes & structure', blurb: 'Blockquotes, horizontal rules and GitHub alerts.' },
  { n: 6, title: 'Tables', blurb: 'Columns, alignment and formatting inside cells.' },
  { n: 7, title: 'GitHub extras', blurb: 'Footnotes, heading links, <details> and friends.' },
  { n: 8, title: 'Gotchas', blurb: 'Blank lines, escaping and fixing broken docs.' },
];

/**
 * Level files: frontmatter, then the target markdown, then optional
 * `+++ card` / `+++ starter` / `+++ learn` / `+++ sheet` / `+++ tip` sections.
 */
export function parseLevel(src: string): Level {
  const fm = /^---\n([\s\S]*?)\n---\n/.exec(src);
  if (!fm) throw new Error('Level is missing frontmatter');
  const meta: Record<string, string> = {};
  for (const line of fm[1].split('\n')) {
    const m = /^(\w+):\s*(.*)$/.exec(line);
    if (m) meta[m[1]] = m[2].trim();
  }
  const [target, ...rest] = src.slice(fm[0].length).split(/^\+\+\+ (\w+)[ \t]*$/m);
  const sections: Record<string, string> = {};
  for (let i = 0; i < rest.length; i += 2) sections[rest[i]] = rest[i + 1].trim();

  return {
    id: meta.id,
    chapter: Number(meta.chapter),
    order: Number(meta.order),
    kind: meta.kind === 'boss' || meta.kind === 'fix' ? meta.kind : 'lesson',
    title: meta.title,
    skills: (meta.skills ?? '').split(',').map((s) => s.trim()).filter(Boolean),
    target: target.trim(),
    starter: sections.starter ? `${sections.starter}\n` : '',
    card: sections.card ?? '',
    learn: sections.learn ?? '',
    sheet: sections.sheet ?? '',
    tip: sections.tip ?? '',
  };
}

const files = import.meta.glob('./levels/*.md', {
  query: '?raw',
  import: 'default',
  eager: true,
}) as Record<string, string>;

/** Every level, in course order. */
export const levels: Level[] = Object.values(files)
  .map(parseLevel)
  .sort((a, b) => a.chapter - b.chapter || a.order - b.order);

export const levelById = (id: string) => levels.find((l) => l.id === id);

export function nextLevel(level: Level): Level | undefined {
  return levels[levels.indexOf(level) + 1];
}

/** The course is linear: a level opens once the one before it is complete. */
export function isUnlocked(level: Level, stars: (id: string) => number): boolean {
  const i = levels.indexOf(level);
  return i === 0 || stars(levels[i - 1].id) > 0;
}

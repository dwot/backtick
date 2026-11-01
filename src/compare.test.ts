import { describe, expect, it } from 'vitest';
import { blockLabels, check, clues } from './compare';
import { chapters, levels } from './levels';
import { starsFor } from './storage';

const statuses = (target: string, input: string) => check(target, input).blocks.map((b) => b.status);

describe('check', () => {
  it('accepts equivalent syntax', () => {
    expect(check('**a** and *b*', '__a__ and _b_').solved).toBe(true);
    expect(check('- one\n- two', '* one\n* two').solved).toBe(true);
    expect(check('1. a\n2. b', '1. a\n1. b').solved).toBe(true);
    expect(check('Title\n=====', '# Title').solved).toBe(true);
  });

  it('treats reference links like inline links', () => {
    expect(check('See [docs](https://x.dev).', 'See [docs][d].\n\n[d]: https://x.dev').solved).toBe(true);
  });

  it('ignores tight vs loose lists and cosmetic whitespace', () => {
    expect(check('- a\n- b', '- a\n\n- b').solved).toBe(true);
    expect(check('| a | b |\n| - | - |\n| 1 | 2 |', '|a|b|\n|---|---|\n|1|2|').solved).toBe(true);
  });

  it('marks a wrong heading level as partial', () => {
    const r = check('## Usage', '### Usage');
    expect(r.blocks).toEqual([{ status: 'partial', reason: 'heading level' }]);
  });

  it('marks missing blocks and counts extras', () => {
    expect(statuses('# A\n\ntext\n\n---', '# A\n\n---')).toEqual(['match', 'miss', 'match']);
    const r = check('# A', '# A\n\nmore');
    expect(r.extra).toBe(1);
    expect(r.solved).toBe(false);
  });

  it('gives specific reasons', () => {
    const table = (a: string) => `| x | y |\n| ${a} | --- |\n| 1 | 2 |`;
    expect(check(table(':---:'), table('---')).blocks[0].reason).toBe('column alignment');
    expect(check('- [x] a', '- [ ] a').blocks[0].reason).toBe('checkbox state');
    expect(check('```bash\nls\n```', '```sh\nls\n```').blocks[0].reason).toBe('code block language');
    expect(check('a **b** c', 'a *b* c').blocks[0].reason).toBe('inline formatting');
    expect(check('- a\n- b', '- a').blocks[0].reason).toBe('number of list items');
  });

  it('handles GitHub alerts', () => {
    expect(check('> [!NOTE]\n> Read this.', '> [!note]\n> Read this.').solved).toBe(true);
    expect(check('> [!NOTE]\n> Read this.', '> [!TIP]\n> Read this.').blocks[0].reason).toBe('alert type');
    expect(statuses('> [!NOTE]\n> Read this.', '> Read this.')).toEqual(['partial']);
    expect(blockLabels('> [!WARNING]\n> x\n\n> y')).toEqual(['Alert', 'Blockquote']);
  });

  it('ignores footnote labels and definition placement', () => {
    const target = 'A[^1] and B[^2].\n\n[^1]: First.\n[^2]: Second.';
    expect(check(target, '[^b]: Second.\n\nA[^a] and B[^b].\n\n[^a]: First.').solved).toBe(true);
    expect(check(target, 'A[^1] and B[^2].\n\n[^1]: Second.\n[^2]: First.').solved).toBe(false);
  });

  it('labels blocks and lists clues', () => {
    expect(blockLabels('## H\n\n- [ ] t\n\n1. a\n\n```js\nx\n```')).toEqual([
      'Heading', 'Task list', 'Ordered list', 'Code block',
    ]);
    expect(clues('[a](u) ![alt](i.png)\n\n```js\nx\n```')).toEqual([
      'Link "a" → u', 'Image alt "alt" → i.png', 'Code block language: js',
    ]);
    expect(clues('[Install](#install)')).toEqual(['Link "Install" → a heading on this page']);
  });
});

describe('levels', () => {
  it('has unique ids and complete chapters', () => {
    expect(new Set(levels.map((l) => l.id)).size).toBe(levels.length);
    for (const ch of chapters) {
      const inChapter = levels.filter((l) => l.chapter === ch.n);
      if (!inChapter.length) continue; // not written yet
      expect(inChapter.map((l) => l.order)).toEqual([1, 2, 3, 4, 5]);
      expect(inChapter.at(-1)!.kind).toBe('boss');
    }
  });

  it.each(levels.map((l) => [l.id, l] as const))('%s is solvable and well-formed', (_, l) => {
    expect(check(l.target, l.target).solved).toBe(true);
    expect(check(l.target, l.starter).solved).toBe(false);
    expect(l.learn).not.toBe('');
    if (l.kind !== 'boss') expect(l.card).not.toBe('');
    if (l.kind !== 'boss') expect(l.sheet).not.toBe('');
    if (l.kind === 'fix') expect(l.starter).not.toBe('');
  });
});

describe('starsFor', () => {
  const attempt = (checks: number, peeked = false) => ({
    rows: Array.from({ length: checks }, () => ({ blocks: [], extra: 0 })),
    peeked,
    draft: '',
  });
  it('rewards recall', () => {
    expect(starsFor(attempt(0))).toBe(3);
    expect(starsFor(attempt(2))).toBe(3);
    expect(starsFor(attempt(3))).toBe(2);
    expect(starsFor(attempt(0, true))).toBe(1);
  });
});

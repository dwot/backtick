import type { Root } from 'mdast';
import { parse } from './markdown';

export type Status = 'match' | 'partial' | 'miss';

export interface BlockFeedback {
  status: Status;
  reason?: string;
}

export interface CheckResult {
  blocks: BlockFeedback[];
  extra: number;
  solved: boolean;
}

/** A normalized mdast node: positions and render-irrelevant fields stripped. */
export type N = { type: string; children?: N[]; [key: string]: unknown };

// Only these attributes affect the rendered output, so only these are compared.
// Things like list `spread` (tight vs loose) or `*` vs `_` are deliberately ignored.
const ATTRS: Record<string, string[]> = {
  heading: ['depth'],
  list: ['ordered', 'start'],
  listItem: ['checked'],
  code: ['lang', 'value'],
  inlineCode: ['value'],
  text: ['value'],
  html: ['value'],
  link: ['url'],
  image: ['url', 'alt'],
  table: ['align'],
  blockquote: ['alert'],
};

const ATTR_LABELS: Record<string, string> = {
  depth: 'heading level',
  ordered: 'list type',
  start: 'list numbering',
  checked: 'checkbox state',
  lang: 'code block language',
  value: 'text',
  url: 'link or image URL',
  alt: 'image alt text',
  align: 'column alignment',
  alert: 'alert type',
};

const COUNT_LABELS: Record<string, string> = {
  list: 'number of list items',
  table: 'number of rows',
  tableRow: 'number of columns',
  blockquote: 'blockquote contents',
  listItem: 'list item contents',
};

const PHRASING = new Set([
  'text', 'emphasis', 'strong', 'delete', 'inlineCode', 'link', 'image', 'break', 'html',
]);

export function normalize(root: Root): N[] {
  const resolved = resolveReferences(root);
  return orderFootnotes(resolved.children ?? []).map(norm);
}

/**
 * Footnotes render at the bottom, numbered by first reference, wherever their
 * definitions were written and whatever their labels. Mirror that: move the
 * definitions to the end in reference order and drop unreferenced ones.
 * (Labels are ignored because ATTRS doesn't compare footnote identifiers.)
 */
function orderFootnotes(blocks: N[]): N[] {
  const defs = new Map<string, N>();
  for (const b of blocks) if (b.type === 'footnoteDefinition') defs.set(b.identifier as string, b);
  if (!defs.size) return blocks;

  const order: string[] = [];
  const walk = (n: N) => {
    if (n.type === 'footnoteReference' && !order.includes(n.identifier as string)) {
      order.push(n.identifier as string);
      const def = defs.get(n.identifier as string);
      if (def) walk(def); // footnotes can reference other footnotes
    }
    n.children?.forEach(walk);
  };
  const rest = blocks.filter((b) => b.type !== 'footnoteDefinition');
  rest.forEach(walk);
  return [...rest, ...order.flatMap((id) => defs.get(id) ?? [])];
}

/** Reference-style links render identically to inline links, so fold them together. */
function resolveReferences(root: Root): N {
  const defs = new Map<string, string>();
  const collect = (n: any) => {
    if (n.type === 'definition') defs.set(n.identifier, n.url);
    n.children?.forEach(collect);
  };
  collect(root);

  const map = (n: any): any => {
    if (n.type === 'linkReference' && defs.has(n.identifier)) {
      return { type: 'link', url: defs.get(n.identifier), children: n.children.map(map) };
    }
    if (n.type === 'imageReference' && defs.has(n.identifier)) {
      return { type: 'image', url: defs.get(n.identifier), alt: n.alt };
    }
    if (!n.children) return n;
    return { ...n, children: n.children.filter((c: any) => c.type !== 'definition').map(map) };
  };
  return map(root);
}

function norm(n: any): N {
  const out: N = { type: n.type };
  for (const key of ATTRS[n.type] ?? []) {
    const v = n[key];
    if (v === undefined || v === null) continue;
    out[key] = key === 'value' ? cleanValue(n.type, v) : v;
  }
  if (n.type === 'list' && !n.ordered) delete out.start;
  if (n.children) out.children = mergeText(n.children.map(norm));
  return out;
}

function cleanValue(type: string, v: string): string {
  if (type === 'code') return v.replace(/[ \t]+$/gm, '');
  if (type === 'html') return v.replace(/>\s+</g, '><').replace(/\s+/g, ' ').trim();
  if (type === 'text') return v.replace(/\s+/g, ' ');
  return v;
}

function mergeText(nodes: N[]): N[] {
  const out: N[] = [];
  for (const n of nodes) {
    const prev = out[out.length - 1];
    if (prev?.type === 'text' && n.type === 'text') {
      prev.value = cleanValue('text', `${prev.value}${n.value}`);
    } else {
      out.push(n);
    }
  }
  return out;
}

function same(a: N, b: N): boolean {
  return JSON.stringify(a) === JSON.stringify(b);
}

/** Describe the first difference between two same-typed blocks, as a gentle hint. */
function firstDiff(a: N, b: N, parent?: string): string {
  if (a.type !== b.type) {
    return PHRASING.has(a.type) || PHRASING.has(b.type) ? 'inline formatting' : 'structure';
  }
  for (const key of ATTRS[a.type] ?? []) {
    if (JSON.stringify(a[key]) !== JSON.stringify(b[key])) return ATTR_LABELS[key];
  }
  const ac = a.children ?? [];
  const bc = b.children ?? [];
  for (let i = 0; i < Math.max(ac.length, bc.length); i++) {
    if (!ac[i] || !bc[i]) return COUNT_LABELS[a.type] ?? 'inline formatting';
    if (!same(ac[i], bc[i])) return firstDiff(ac[i], bc[i], a.type);
  }
  return parent ? 'structure' : 'details';
}

/**
 * Pair target blocks with input blocks, preserving order. Blocks pair only when
 * they share a type; exact matches score higher so they win ties.
 * Returns, for each target block, the index of its paired input block (or null).
 */
function align(t: N[], u: N[]): (number | null)[] {
  const score = (a: N, b: N) => (a.type !== b.type ? 0 : same(a, b) ? 3 : 2);
  const dp = Array.from({ length: t.length + 1 }, () => new Array<number>(u.length + 1).fill(0));
  for (let i = 1; i <= t.length; i++) {
    for (let j = 1; j <= u.length; j++) {
      const s = score(t[i - 1], u[j - 1]);
      dp[i][j] = Math.max(dp[i - 1][j], dp[i][j - 1], s ? dp[i - 1][j - 1] + s : 0);
    }
  }
  const pairs: (number | null)[] = new Array(t.length).fill(null);
  let i = t.length;
  let j = u.length;
  while (i > 0 && j > 0) {
    const s = score(t[i - 1], u[j - 1]);
    if (s && dp[i][j] === dp[i - 1][j - 1] + s) {
      pairs[i - 1] = j - 1;
      i--;
      j--;
    } else if (dp[i][j] === dp[i - 1][j]) {
      i--;
    } else {
      j--;
    }
  }
  return pairs;
}

export function check(targetMd: string, inputMd: string): CheckResult {
  const t = normalize(parse(targetMd));
  const u = normalize(parse(inputMd));
  const pairs = align(t, u);
  const blocks: BlockFeedback[] = t.map((tb, i) => {
    const j = pairs[i];
    if (j === null) return { status: 'miss' };
    if (same(tb, u[j])) return { status: 'match' };
    return { status: 'partial', reason: firstDiff(tb, u[j]) };
  });
  const extra = u.length - pairs.filter((j) => j !== null).length;
  return { blocks, extra, solved: extra === 0 && blocks.every((b) => b.status === 'match') };
}

const BLOCK_LABELS: Record<string, string> = {
  paragraph: 'Paragraph',
  blockquote: 'Blockquote',
  code: 'Code block',
  table: 'Table',
  thematicBreak: 'Horizontal rule',
  html: 'HTML',
  footnoteDefinition: 'Footnote',
};

/** Human labels for the target's blocks, revealed on tiles once guessed. */
export function blockLabels(targetMd: string): string[] {
  return normalize(parse(targetMd)).map((b) => {
    if (b.type === 'heading') return 'Heading';
    if (b.type === 'blockquote' && b.alert) return 'Alert'; // the level is part of the puzzle
    if (b.type === 'list') {
      const task = b.children?.some((li) => li.checked !== undefined);
      return task ? 'Task list' : b.ordered ? 'Ordered list' : 'Bulleted list';
    }
    return BLOCK_LABELS[b.type] ?? b.type;
  });
}

/**
 * Things the rendered target can't show you: link targets, image sources/alt
 * text and code fence languages. Listed as clues beside the target.
 */
export function clues(targetMd: string): string[] {
  const out: string[] = [];
  const text = (n: N): string =>
    n.type === 'text' || n.type === 'inlineCode' ? String(n.value) : (n.children ?? []).map(text).join('');
  const walk = (n: N) => {
    if (n.type === 'link') {
      const img = n.children?.length === 1 && n.children[0].type === 'image' ? n.children[0] : null;
      const url = String(n.url);
      if (img) out.push(`Image "${img.alt}" links to → ${url}`);
      // Working out a heading's anchor slug is part of the puzzle, so don't give it away.
      else if (url.startsWith('#')) out.push(`Link "${text(n)}" → a heading on this page`);
      else out.push(`Link "${text(n)}" → ${url}`);
    }
    if (n.type === 'image') out.push(`Image alt "${n.alt}" → ${n.url}`);
    if (n.type === 'code' && n.lang) out.push(`Code block language: ${n.lang}`);
    n.children?.forEach(walk);
  };
  normalize(parse(targetMd)).forEach(walk);
  return out;
}

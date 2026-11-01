import { unified } from 'unified';
import remarkParse from 'remark-parse';
import remarkGfm from 'remark-gfm';
import remarkRehype from 'remark-rehype';
import rehypeRaw from 'rehype-raw';
import rehypeSanitize, { defaultSchema, type Options as SanitizeSchema } from 'rehype-sanitize';
import rehypeStringify from 'rehype-stringify';
import type { Blockquote, Root } from 'mdast';

const ALERT_TITLES: Record<string, string> = {
  note: 'Note',
  tip: 'Tip',
  important: 'Important',
  warning: 'Warning',
  caution: 'Caution',
};
const ALERT_MARKER = /^\[!(note|tip|important|warning|caution)\][ \t]*(?:\n|$)/i;

/**
 * GitHub alerts: a blockquote whose first line is `[!NOTE]`, `[!WARNING]`…
 * Strips the marker and records the type as `alert` on the blockquote. With
 * `render`, also turns it into GitHub's `markdown-alert` markup.
 */
function remarkAlerts({ render = false } = {}) {
  return (tree: Root) => {
    const walk = (node: any) => {
      if (node.type === 'blockquote') markAlert(node, render);
      node.children?.forEach(walk);
    };
    walk(tree);
  };
}

function markAlert(node: Blockquote & { alert?: string }, render: boolean) {
  const para = node.children[0];
  const text = para?.type === 'paragraph' ? para.children[0] : undefined;
  const m = text?.type === 'text' ? ALERT_MARKER.exec(text.value) : null;
  if (!m || !text || text.type !== 'text' || para.type !== 'paragraph') return;

  const type = m[1].toLowerCase();
  node.alert = type;
  text.value = text.value.slice(m[0].length);
  if (!text.value) para.children.shift();
  if (!para.children.length) node.children.shift();
  if (render) {
    node.data = { hName: 'div', hProperties: { className: ['markdown-alert', `markdown-alert-${type}`] } };
    node.children.unshift({
      type: 'paragraph',
      data: { hProperties: { className: ['markdown-alert-title'] } },
      children: [{ type: 'text', value: ALERT_TITLES[type] }],
    });
  }
}

const schema: SanitizeSchema = {
  ...defaultSchema,
  // remark-rehype already prefixes footnote ids with `user-content-`; don't double it.
  clobberPrefix: '',
  attributes: {
    ...defaultSchema.attributes,
    div: [...(defaultSchema.attributes?.div ?? []), ['className', /^markdown-alert/]],
    p: [...(defaultSchema.attributes?.p ?? []), ['className', 'markdown-alert-title']],
  },
};

const parser = unified().use(remarkParse).use(remarkGfm).use(remarkAlerts);

const renderer = unified()
  .use(remarkParse)
  .use(remarkGfm)
  .use(remarkAlerts, { render: true })
  .use(remarkRehype, { allowDangerousHtml: true })
  .use(rehypeRaw)
  .use(rehypeSanitize, schema) // GitHub-like allowlist: keeps <details>, <kbd>, <sub>…
  .use(rehypeStringify);

export function parse(md: string): Root {
  return parser.runSync(parser.parse(md)) as Root;
}

export function render(md: string): string {
  return String(renderer.processSync(md));
}

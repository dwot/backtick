import 'github-markdown-css/github-markdown.css';
import './tokens.css';
import './style.css';
import {
  EditorView, drawSelection, dropCursor, highlightSpecialChars, keymap, lineNumbers,
} from '@codemirror/view';
import { defaultKeymap, history, historyKeymap, indentLess, indentMore } from '@codemirror/commands';
import { highlightSelectionMatches, searchKeymap } from '@codemirror/search';
import { Prec } from '@codemirror/state';
import { render } from './markdown';
import { blockLabels, check, clues } from './compare';
import {
  chapters, isUnlocked, levelById, levels, nextLevel, type Level, type LevelKind,
} from './levels';
import { FREE_CHECKS, loadState, saveState, starsFor, type Attempt } from './storage';

const $ = <T extends HTMLElement = HTMLElement>(id: string) => document.getElementById(id) as T;

const state = loadState();
const starsOf = (id: string) => state.stars[id] ?? 0;
const KIND_LABELS: Record<LevelKind, string> = { lesson: 'Lesson', fix: 'Fix-it', boss: 'Boss' };

let level: Level;
let attempt: Attempt;
let labels: string[] = [];
/** Set once the current attempt is solved, so further typing doesn't re-complete it. */
let finished = false;
/** Whether the preview panel is showing (only possible after peeking). */
let previewOpen = false;
/** Cheat sheet entry added by the last first-time clear, highlighted on the next visit. */
let freshEntry: string | undefined;

type View = 'map' | 'level' | 'sheet';
let view: View | undefined;

function showView(v: View) {
  view = v;
  for (const name of ['map', 'level', 'sheet']) $(`${name}-view`).classList.toggle('hidden', name !== v);
  $('nav-sheet').classList.toggle('active', v === 'sheet');
}

const starText = (n: number, of = 3) =>
  `<span class="stars" aria-label="${n} of ${of} stars">${'★'.repeat(n)}${'☆'.repeat(of - n)}</span>`;

const escapeHtml = (s: string) =>
  s.replace(/[&<>"]/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' })[c]!);

function updateStarTotal() {
  const earned = levels.reduce((sum, l) => sum + starsOf(l.id), 0);
  $('star-total').innerHTML = `★ ${earned} <span class="muted">/ ${levels.length * 3}</span>`;
}

// ---------- Editor ----------

const editor = new EditorView({
  parent: $('editor'),
  extensions: [
    // A deliberately plain editor: no markdown highlighting, list continuation,
    // bracket closing or autocomplete, since those would give answers away.
    lineNumbers(),
    highlightSpecialChars(),
    history(),
    drawSelection(),
    dropCursor(),
    highlightSelectionMatches(),
    keymap.of([...defaultKeymap, ...historyKeymap, ...searchKeymap]),
    EditorView.lineWrapping,
    Prec.highest(keymap.of([
      { key: 'Mod-Enter', run: () => (submit(), true) },
      // Tab types two spaces (or indents a multi-line selection); Shift+Tab outdents.
      {
        key: 'Tab',
        run: (v) => {
          const { main } = v.state.selection;
          if (v.state.doc.lineAt(main.from).number !== v.state.doc.lineAt(main.to).number) return indentMore(v);
          v.dispatch(v.state.replaceSelection('  '), { scrollIntoView: true, userEvent: 'input' });
          return true;
        },
        shift: indentLess,
      },
    ])),
    EditorView.updateListener.of((u) => {
      if (!u.docChanged || !attempt) return;
      attempt.draft = u.state.doc.toString();
      saveState(state);
      schedulePreview();
      scheduleAutoSolve();
    }),
    EditorView.theme({
      '&': { backgroundColor: 'var(--surface)', color: 'var(--text)' },
      '.cm-gutters': { backgroundColor: 'var(--surface)', color: 'var(--muted)', border: 'none' },
      '.cm-activeLine, .cm-activeLineGutter': { backgroundColor: 'transparent' },
      '.cm-content': { caretColor: 'var(--text)', minHeight: '180px' },
      // CodeMirror draws its own caret (black by default), invisible in dark mode.
      '.cm-cursor, .cm-dropCursor': { borderLeft: '2px solid var(--text)' },
      '&.cm-focused .cm-selectionBackground, .cm-selectionBackground': {
        backgroundColor: 'color-mix(in srgb, var(--partial) 35%, transparent) !important',
      },
    }),
  ],
});

function setEditorText(text: string) {
  editor.dispatch({ changes: { from: 0, to: editor.state.doc.length, insert: text } });
}

let previewTimer: number | undefined;
function schedulePreview() {
  if (!previewOpen) return;
  clearTimeout(previewTimer);
  previewTimer = window.setTimeout(() => ($('preview').innerHTML = render(attempt.draft)), 80);
}

// Typing the right answer completes the level without spending a check.
let solveTimer: number | undefined;
function scheduleAutoSolve() {
  clearTimeout(solveTimer);
  solveTimer = window.setTimeout(() => {
    if (!finished && check(level.target, attempt.draft).solved) complete();
  }, 500);
}

// ---------- Map ----------

function showMap() {
  showView('map');
  $('meta').textContent = `A ${chapters.length * 5}-level markdown course`;
  updateStarTotal();

  const next = levels.find((l) => !starsOf(l.id) && isUnlocked(l, starsOf));
  const hero = next
    ? `<a class="continue" href="#/level/${next.id}">
         <span class="muted">${starsOf(levels[0].id) ? 'Continue' : 'Start'}</span>
         <b>${next.chapter}-${next.order} · ${escapeHtml(next.title)}</b>
       </a>`
    : `<div class="continue"><b>All written levels complete.</b><span class="muted">Go back for missing stars ★</span></div>`;

  const sections = chapters.map((ch) => {
    const inChapter = levels.filter((l) => l.chapter === ch.n);
    const earned = inChapter.reduce((sum, l) => sum + starsOf(l.id), 0);
    const nodes = inChapter.length
      ? inChapter
          .map((l) => {
            const open = isUnlocked(l, starsOf);
            const stars = starsOf(l.id);
            const cls = ['node', l.kind, stars ? 'done' : open ? 'open' : 'locked', l === next ? 'next' : '']
              .join(' ');
            const inner = `
              <span class="node-kind">${KIND_LABELS[l.kind]}</span>
              <span class="node-title">${escapeHtml(l.title)}</span>
              ${open ? starText(stars) : '<span class="lock">locked</span>'}`;
            return open
              ? `<li><a class="${cls}" href="#/level/${l.id}">${inner}</a></li>`
              : `<li><div class="${cls}">${inner}</div></li>`;
          })
          .join('')
      : '<li class="soon">Coming soon</li>';
    return `
      <section class="chapter ${inChapter.length ? '' : 'unwritten'}">
        <div class="chapter-head">
          <span class="chapter-n">Chapter ${ch.n}</span>
          <h2>${escapeHtml(ch.title)}</h2>
          ${inChapter.length ? `<span class="chapter-stars">★ ${earned} / ${inChapter.length * 3}</span>` : ''}
          <p>${escapeHtml(ch.blurb)}</p>
        </div>
        <ol class="nodes">${nodes}</ol>
      </section>`;
  });

  $('map-view').innerHTML = hero + sections.join('') + `<p class="legal">Also from plaintext.guru: <a href="https://tilde.plaintext.guru">Tilde</a>, the shell, <a href="https://caret.plaintext.guru">Caret</a>, for regular expressions, and <a href="https://hash.plaintext.guru">Hash</a>, for git</p><p class="legal"><a href="https://github.com/dwot/backtick">Source on GitHub</a> · <a href="third-party.txt">Licences</a> · Visits are counted with Cloudflare Web Analytics</p>`;
  window.scrollTo(0, 0);
}

// ---------- Cheat sheet ----------

function showSheet() {
  showView('sheet');
  $('meta').textContent = 'Cheat sheet';
  updateStarTotal();

  const entries = levels.filter((l) => l.sheet);
  const collected = entries.filter((l) => starsOf(l.id)).length;

  const entry = (l: Level) => {
    if (!starsOf(l.id)) {
      const hint = isUnlocked(l, starsOf)
        ? `<a href="#/level/${l.id}">Play ${l.chapter}-${l.order}</a> to add this.`
        : `Clear ${l.chapter}-${l.order} to add this.`;
      return `<article class="entry locked"><h3>${escapeHtml(l.title)}</h3><p>${hint}</p></article>`;
    }
    return `
      <article class="entry ${l.id === freshEntry ? 'fresh' : ''}" id="entry-${l.id}">
        <div class="entry-head">
          <h3>${escapeHtml(l.title)}</h3>
          <button class="ghost copy" data-id="${l.id}">Copy</button>
        </div>
        <div class="entry-body">
          <pre class="entry-source">${escapeHtml(l.sheet)}</pre>
          <div class="entry-render markdown-body">${render(l.sheet)}</div>
        </div>
        ${l.tip ? `<div class="entry-tip">${render(l.tip)}</div>` : ''}
      </article>`;
  };

  const sections = chapters.map((ch) => `
    <section>
      <div class="chapter-head">
        <span class="chapter-n">Chapter ${ch.n}</span>
        <h2>${escapeHtml(ch.title)}</h2>
      </div>
      <div class="entries">${entries.filter((l) => l.chapter === ch.n).map(entry).join('')}</div>
    </section>`);

  $('sheet-view').innerHTML = `
    <div class="sheet-head">
      <h2>Cheat sheet</h2>
      <p class="muted">${collected} of ${entries.length} collected. Each lesson you clear adds its syntax here.</p>
      <div class="progress"><span style="width: ${(100 * collected) / entries.length}%"></span></div>
    </div>
    ${sections.join('')}`;

  const fresh = freshEntry && document.getElementById(`entry-${freshEntry}`);
  freshEntry = undefined;
  if (fresh) fresh.scrollIntoView({ block: 'center' });
  else window.scrollTo(0, 0);
}

$('sheet-view').addEventListener('click', async (e) => {
  const button = (e.target as HTMLElement).closest<HTMLButtonElement>('button.copy');
  const l = button && levelById(button.dataset.id!);
  if (!button || !l) return;
  try {
    await navigator.clipboard.writeText(l.sheet);
    button.textContent = 'Copied';
  } catch {
    button.textContent = 'Copy failed';
  }
  setTimeout(() => (button.textContent = 'Copy'), 1200);
});

// ---------- Level ----------

function showLevel(l: Level) {
  level = l;
  attempt = state.attempts[l.id] ??= { rows: [], peeked: false, draft: l.starter };
  labels = blockLabels(l.target);
  finished = false;
  previewOpen = attempt.peeked;

  showView('level');
  $('meta').textContent = `Chapter ${l.chapter} · ${KIND_LABELS[l.kind]} · ${l.title}`;
  updateStarTotal();

  $('card-panel').classList.toggle('hidden', !l.card);
  $('card').innerHTML = render(l.card);
  $('target-title').textContent = l.kind === 'fix' ? 'Fix the doc to render this' : 'Recreate this';
  $('target').innerHTML = render(l.target);
  $('clues').replaceChildren(
    ...clues(l.target).map((c) => Object.assign(document.createElement('li'), { textContent: c })),
  );

  setEditorText(attempt.draft);
  renderPeek();
  renderRows(false);
  window.scrollTo(0, 0);
  editor.focus();
}

function submit() {
  if (finished) return;
  const result = check(level.target, attempt.draft);
  attempt.rows.push({ blocks: result.blocks, extra: result.extra });
  saveState(state);
  renderRows(true);
  if (result.solved) complete();
}

function peek() {
  if (!attempt.peeked) {
    attempt.peeked = true;
    saveState(state);
    renderRows(false); // updates the "worth" stars
  }
  previewOpen = !previewOpen;
  renderPeek();
}

function renderPeek() {
  $('preview-panel').classList.toggle('hidden', !previewOpen);
  if (previewOpen) $('preview').innerHTML = render(attempt.draft);
  $('peek').innerHTML = attempt.peeked
    ? previewOpen ? 'Hide preview' : 'Show preview'
    : `Peek at preview <span class="muted">(caps at ★)</span>`;
}

function renderRows(animateLast: boolean) {
  const tiles = (statuses: (string | undefined)[]) =>
    statuses.map((s, b) => {
      const tile = document.createElement('div');
      tile.className = `tile ${s ?? ''}`;
      // Block kinds stay hidden until you've at least found the right element.
      if (s === 'match' || s === 'partial') tile.title = labels[b];
      return tile;
    });

  const rows = attempt.rows.map((row, i) => {
    const el = document.createElement('div');
    el.className = 'row';
    if (animateLast && i === attempt.rows.length - 1) el.classList.add('fresh');
    el.append(...tiles(row.blocks.map((b) => b.status)));
    if (row.extra) {
      el.append(Object.assign(document.createElement('span'), {
        className: 'extra',
        textContent: `+${row.extra} extra`,
      }));
    }
    return el;
  });
  if (!finished) {
    // A ghost row shows how many blocks the target has.
    const ghost = document.createElement('div');
    ghost.className = 'row ghost';
    ghost.append(...tiles(labels.map(() => undefined)));
    rows.push(ghost);
  }
  $('rows').replaceChildren(...rows);
  $('rows').scrollTop = $('rows').scrollHeight;

  const last = attempt.rows[attempt.rows.length - 1];
  const reasons: string[] = [];
  if (last && !finished) {
    last.blocks.forEach((b, i) => {
      if (b.status === 'partial') reasons.push(`${labels[i]}: close, check the ${b.reason}`);
    });
    if (last.extra) reasons.push(`${last.extra} block${last.extra > 1 ? 's' : ''} that aren't in the target`);
  }
  $('reasons').replaceChildren(
    ...reasons.map((r) => Object.assign(document.createElement('li'), { textContent: r })),
  );

  const free = FREE_CHECKS - attempt.rows.length;
  const note = attempt.peeked
    ? 'peeked'
    : free > 0 ? `${free} free check${free > 1 ? 's' : ''} left` : 'checks are free now';
  $('worth').innerHTML = `${finished ? 'Earned' : 'Worth'} ${starText(starsFor(attempt))} <span class="muted">${note}</span>`;
  $<HTMLButtonElement>('check').disabled = finished;
}

function complete() {
  finished = true;
  const earned = starsFor(attempt);
  const before = starsOf(level.id);
  state.stars[level.id] = Math.max(before, earned);
  if (!before && level.sheet) freshEntry = level.id;
  delete state.attempts[level.id];
  saveState(state);
  renderRows(false);
  updateStarTotal();
  setTimeout(() => showResults(earned, before), 600);
}

// ---------- Modals ----------

const modal = $<HTMLDialogElement>('modal');
modal.querySelector('.close')!.addEventListener('click', () => modal.close());
modal.addEventListener('click', (e) => e.target === modal && modal.close());

function openModal(html: string) {
  $('modal-body').innerHTML = html;
  if (!modal.open) modal.showModal();
  $('modal-body').focus();
}

function showResults(earned: number, before: number) {
  const next = nextLevel(level);
  const headline = ['', 'Solved', 'Nicely done', 'From memory!'][earned];
  const best = earned > before && before > 0 ? '<span class="chip">New best</span>' : '';
  openModal(`
    <div class="result-stars">${starText(earned)}</div>
    <h2>${headline} ${best}</h2>
    <div class="chips">${level.skills.map((s) => `<span class="chip">${escapeHtml(s)}</span>`).join('')}</div>
    <h3>Learned</h3>
    <div class="learn markdown-body">${render(level.learn)}</div>
    ${!before && level.sheet ? `<p class="sheet-note">New on your <a href="#/sheet">cheat sheet</a>: ${escapeHtml(level.title)}</p>` : ''}
    <h3>One way to write it</h3>
    <div class="source">${escapeHtml(level.target)}</div>
    <div class="actions">
      ${next ? `<button class="primary" id="next">Next: ${escapeHtml(next.title)}</button>` : ''}
      <button id="replay">Replay${earned < 3 ? ' for ★★★' : ''}</button>
      <button id="to-map">Map</button>
    </div>`);
  $('next')?.addEventListener('click', () => {
    modal.close();
    location.hash = `#/level/${next!.id}`;
  });
  $('replay').addEventListener('click', () => {
    modal.close();
    showLevel(level);
  });
  $('to-map').addEventListener('click', () => {
    modal.close();
    location.hash = '#/';
  });
}

function showHelp() {
  const tile = (s: string) => `<span class="tile ${s}"></span>`;
  openModal(`
    <h2>How to play</h2>
    <p>Each level shows rendered markdown. Write markdown that renders the same way. The level completes as soon as it matches.</p>
    <p><b>Check</b> to get one tile per block in the target (heading, paragraph, list…):</p>
    <div class="help-rows">
      <div>${tile('match')} The block matches exactly.</div>
      <div>${tile('partial')} Right kind of block, but the details differ.</div>
      <div>${tile('miss')} Missing, or not the right kind of block.</div>
    </div>
    <p>Stars reward working from memory:</p>
    <div class="help-rows">
      <div>${starText(3)} No peeking, ${FREE_CHECKS} checks or fewer</div>
      <div>${starText(2)} No peeking, more checks</div>
      <div>${starText(1)} Solved with the live preview</div>
    </div>
    <p>Stuck? <b>Peek</b> turns on the live preview so you can always finish, and you can replay later for more stars. Rendering is what counts: <code>*a*</code> and <code>_a_</code> both work.</p>`);
}

// ---------- Wiring ----------

$('check').addEventListener('click', submit);
$('peek').addEventListener('click', peek);
$('btn-help').addEventListener('click', showHelp);

function route() {
  // In-page anchors (footnotes, heading links) aren't routes: let the browser just scroll.
  if (view && location.hash && !location.hash.startsWith('#/')) return;
  if (modal.open) modal.close();
  if (location.hash === '#/sheet') return showSheet();
  const m = /^#\/level\/(.+)$/.exec(location.hash);
  const l = m ? levelById(m[1]) : undefined;
  if (l && isUnlocked(l, starsOf)) showLevel(l);
  else showMap();
}
window.addEventListener('hashchange', route);
route();
if (!Object.keys(state.stars).length && !Object.keys(state.attempts).length) showHelp();

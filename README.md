# Backtick

A calm, level-based course for learning GitHub Flavored Markdown, from zero to writing a full README.

Each level shows rendered markdown, and you write markdown that renders the same. **Check** gives one tile per block: 🟩 exact, 🟨 right kind of block but the details differ, ⬜ missing. A level completes as soon as your markdown matches.

Stars reward working from memory:

- ★★★: no peeking, 2 checks or fewer
- ★★: no peeking, more checks
- ★: solved with the live preview (**Peek**), which is always available so you never get stuck

The course has 8 chapters of 5 levels: 4 lessons (each with a syntax card) and a boss. Fix-it levels hand you a broken doc to repair. Every lesson and fix-it you clear adds an entry to your **cheat sheet** (`#/sheet`): the syntax, its render and a tip. All 8 chapters are written: Text, Lists, Links & images, Code, Quotes & structure, Tables, GitHub extras and Gotchas.

## Running it

```bash
npm install
npm run dev     # http://localhost:5173
npm test        # checker + level sanity tests
```

## How checking works

Both the target and your input are parsed to an mdast AST (`remark-parse` + `remark-gfm`), then normalized so only what affects the render is compared. `*a*` and `_a_` count as the same, and so do reference links and inline links, `1.` and `2.` numbering, or footnote labels and where their definitions sit. GitHub alerts (`> [!NOTE]`) are supported by a small remark plugin in `src/markdown.ts`. Blocks are aligned in order, so one extra paragraph doesn't knock everything after it out of place. See `src/compare.ts`.

## Writing levels

Levels live in `src/levels/*.md` (file names are just for sorting; order comes from the frontmatter).

```md
---
id: task-lists        # stable: progress is stored by id
chapter: 2
order: 4              # 1–4 lessons, 5 is the boss
kind: lesson          # lesson | fix | boss
title: Task lists
skills: task lists
---
## Roadmap

- [x] Markdown parser

+++ card
Syntax card shown before you start (required for lessons and fix-its).

+++ starter
Optional initial editor contents, i.e. the broken doc for `fix` levels.

+++ learn
Markdown for the "Learned" card shown after the level.

+++ sheet
Cheat sheet snippet, shown as source and render (required for lessons and fix-its).

+++ tip
Optional one-line note under the cheat sheet entry.
```

`npm test` checks that every chapter has 5 levels ending in a boss, that every level solves itself, and that its starter doesn't.

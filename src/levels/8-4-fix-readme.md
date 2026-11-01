---
id: fix-readme
chapter: 8
order: 4
kind: fix
title: Fix the README
skills: headings, alerts, fenced code, tables, links
---
# Backtick

A markdown course you play.

> [!NOTE]
> Requires Node 22.

## Quick start

```sh
npm install
npm run dev
```

| Command | What it does |
| --- | --- |
| `check` | Submit your markdown |

See the [docs](https://backtick.dev/docs).

+++ card
A real-world mess: this README has **six** bugs, all ones you've learned to spot. Hunt them down.

+++ starter
#Backtick
A markdown course you play.

> [NOTE]
> Requires Node 22.
##Quick start
```sh
npm install
npm run dev

| Command | What it does |
| `check` | Submit your markdown |

See the [docs] (https://backtick.dev/docs).

+++ learn
The six bugs:

1. `#Backtick` has no space after the `#`.
2. `[NOTE]` is missing its `!`, so it's just a quote.
3. `##Quick start` has no space and no blank line, so it was swallowed into the quote.
4. The code fence is never closed, so it swallows the rest of the file.
5. The table has no delimiter row.
6. `[docs] (url)` has a space between `]` and `(`, so it isn't a link.

+++ sheet
- [ ] A space after every `#`
- [ ] `[!NOTE]`, with the `!`
- [ ] Blank line before headings, lists and tables
- [ ] Every code fence closed
- [ ] Every table has a delimiter row
- [ ] No space in `](`

+++ tip
A README pre-flight checklist.

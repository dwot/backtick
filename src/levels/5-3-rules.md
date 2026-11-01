---
id: horizontal-rules
chapter: 5
order: 3
kind: fix
title: Horizontal rules
skills: horizontal rules, headings, blank lines
---
## v1.2.0

Added hard mode.

---

## v1.1.0

Added the level map.

+++ card
Three or more `-`, `*` or `_` on a line by themselves make a horizontal rule:

```md
Above.

---

Below.
```

But `---` directly **under a line of text** turns that text into a heading (an old heading syntax called *setext*). This changelog has that bug. Fix it.

+++ starter
## v1.2.0

Added hard mode.
---
## v1.1.0

Added the level map.

+++ learn
Always leave a blank line before `---`. Or use `***`, which never means "heading".

The same underline trick with `===` makes an H1. It's legal, but rare in modern READMEs.

+++ sheet
Above.

---

Below.

+++ tip
`---` right under text turns that text into a heading. Leave a blank line.

---
id: escaping
chapter: 8
order: 2
kind: lesson
title: Escaping
skills: escaping
---
\# Not a heading

Use \*args and \*\*kwargs, not \_private\_ names.

1986\. A great year for markdown? No, that was 2004.

+++ card
Put a backslash before a punctuation character to show it literally instead of as markdown:

```md
\*not italic\*   \# not a heading   \[not a link\]
```

This works for any ASCII punctuation: `` \` `` `\*` `\_` `\#` `\[` `\]` `\.` `\|` and more.

+++ learn
`1986.` at the start of a line begins a numbered list, so `1986\.` is the fix. It's one of the stranger escapes, but it really does come up.

Inline code is often the better choice for code-ish text like `*args`. Escaping is for when you want normal prose that happens to include markdown characters.

+++ sheet
\*not italic\* \# not a heading \[not a link\]

+++ tip
A backslash escapes any ASCII punctuation.

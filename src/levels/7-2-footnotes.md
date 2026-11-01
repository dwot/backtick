---
id: footnotes
chapter: 7
order: 2
kind: lesson
title: Footnotes
skills: footnotes
---
Backtick compares the rendered output[^1], not your exact characters. Tight and loose lists count as the same[^lists].

[^1]: Strictly speaking, the parsed syntax tree.
[^lists]: They render slightly differently, but hardly anyone notices.

+++ card
Mark a footnote with `[^label]` in the text, then define it on its own line:

```md
Here's a claim.[^1]

[^1]: Here's the source.
```

GitHub numbers footnotes in the order they're **referenced** and collects them at the bottom, wherever you defined them.

+++ learn
Labels can be words (`[^lists]`), which are easier to keep track of than numbers when you reorder text. They still render as 1, 2, 3.

Each footnote gets a ↩ link back to where it was referenced.

+++ sheet
A claim.[^1]

[^1]: The source.

+++ tip
Numbered in the order they're referenced; listed at the bottom.

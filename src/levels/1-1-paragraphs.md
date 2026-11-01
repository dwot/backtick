---
id: paragraphs
chapter: 1
order: 1
kind: lesson
title: Paragraphs & line breaks
skills: paragraphs, hard breaks
---
Backtick is a puzzle game about markdown.

You write the markdown,\
it checks the render.

+++ card
Markdown is mostly plain text. A **blank line** starts a new paragraph:

```md
First paragraph.

Second paragraph.
```

A single line break *inside* a paragraph is ignored and becomes a space. To force a line break, end the line with a backslash:

```md
Roses are red,\
violets are blue.
```

+++ learn
Two trailing spaces also make a hard break, but they're invisible and editors often strip them, so prefer `\`.

Since single line breaks are ignored, many people write **one sentence per line** in the source. It renders as normal paragraphs but makes git diffs much easier to read.

+++ sheet
First paragraph.

Second paragraph,\
with a forced line break.

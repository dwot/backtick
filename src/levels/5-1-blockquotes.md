---
id: blockquotes
chapter: 5
order: 1
kind: lesson
title: Blockquotes
skills: blockquotes
---
> Markdown is intended to be as easy-to-read and easy-to-write as is feasible.
>
> Readability, however, is emphasized above all else.

From the original *Markdown* syntax docs.

+++ card
Start a line with `>` to quote it:

```md
> Quoted text.
>
> Still the same quote, second paragraph.
```

A line with just `>` keeps both paragraphs in **one** quote. A truly blank line ends the quote.

+++ learn
Watch out for lines *without* `>` straight after a quote: markdown treats them as part of the quote (a "lazy" continuation). You'll fix exactly that in chapter 8.

Quotes are handy for citing an issue or someone else's words, or for side notes.

+++ sheet
> Quoted.
>
> Same quote, second paragraph.

+++ tip
A truly blank line ends the quote.

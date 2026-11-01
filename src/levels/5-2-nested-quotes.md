---
id: nested-quotes
chapter: 5
order: 2
kind: lesson
title: Inside a quote
skills: blockquotes, ordered lists, nesting
---
> **Upgrading from v1?**
>
> 1. Rename `config.yml` to `backtick.json`
> 2. Run `backtick migrate`
>
> > Old configs still load, but print a warning.

+++ card
Anything can go inside a quote. Write it as usual, with `>` in front of every line:

```md
> - a list
> - in a quote
>
> > A quote inside a quote.
```

`> >` (or `>>`) nests one quote inside another.

+++ learn
Many editors (and GitHub's own "Quote reply") add the `> ` prefixes for you. Select the text, then quote it.

+++ sheet
> - A list in a quote
>
> > A quote in a quote

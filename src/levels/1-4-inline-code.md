---
id: inline-code
chapter: 1
order: 4
kind: lesson
title: Inline code
skills: inline code
---
Run `npm test` before you push.

Settings live in `.env.local`, and the `--watch` flag reruns on save.

+++ card
Wrap commands, file names, flags and identifiers in **single backticks**:

```md
Edit `config.json` and run `make`.
```

Everything inside is shown literally in a monospace font: `` `**not bold**` `` renders the asterisks as-is.

+++ learn
To show a backtick *inside* inline code, wrap it in double backticks with spaces:

```md
`` a`b ``
```

A good habit for READMEs: anything a reader might copy and paste (commands, paths, env vars) goes in backticks.

+++ sheet
Run `npm test`. A backtick inside: `` a`b ``

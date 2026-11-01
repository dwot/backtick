---
id: ordered
chapter: 2
order: 2
kind: lesson
title: Numbered lists
skills: ordered lists
---
## Getting started

1. Clone the repo
2. Install dependencies
3. Run `npm start`

When you're ready to ship:

4. Run `npm run build`
5. Deploy the `dist` folder

+++ card
Number each line with `1.`, `2.` and so on, followed by a space:

```md
1. Do this
2. Then this
```

Only the **first** number matters. It sets where the list starts, and later items count up from there:

```md
7. Seventh
1. Eighth (really!)
```

+++ learn
Since only the first number counts, many people write `1.` for **every** item. Reordering steps then never means renumbering, and diffs stay small.

`1)` works as well as `1.`.

+++ sheet
1. First
2. Second

7. Starts at seven
1. Then eight

+++ tip
Only the first number counts.

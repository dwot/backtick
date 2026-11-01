---
id: blank-lines
chapter: 8
order: 1
kind: fix
title: Blank lines
skills: blank lines, lists, details
---
Steps to reproduce:

1. Open a level
2. Press check

Expected: green tiles.

<details>
<summary>Logs</summary>

Nothing **useful** here.

</details>

+++ card
Most "why won't this render?" bugs come down to a missing blank line. Two classics:

- A line right after a list item **joins that item**, even without indentation.
- Inside HTML like `<details>`, markdown only renders after a blank line. Until then, it's treated as raw HTML.

This bug report has both. Fix it.

+++ starter
Steps to reproduce:
1. Open a level
2. Press check
Expected: green tiles.
<details>
<summary>Logs</summary>
Nothing **useful** here.
</details>

+++ learn
Some things *can* follow a paragraph directly: a list starting with `1.` or `-`, a heading, a fence, even a table. But a blank line between blocks is never wrong, so make it a habit.

The `<details>` rule comes from how HTML blocks work: an HTML block runs until the next blank line, and everything in it is passed through as raw HTML.

+++ sheet
- An item

A blank line ends the list.

+++ tip
Without it, the next line joins the item. Same inside `<details>`: blank line first.

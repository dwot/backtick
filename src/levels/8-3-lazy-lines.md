---
id: lazy-lines
chapter: 8
order: 3
kind: fix
title: Lazy lines
skills: blockquotes, lists, lazy continuation
---
> [!TIP]
> Hold <kbd>Shift</kbd> to select.

Then press <kbd>Delete</kbd>.

- First item
- Second item

  A second paragraph in the second item.

+++ card
Markdown is "lazy": a line of plain text straight after a quote or list item **continues** it, even without `>` or indentation.

To end a quote or list, leave a blank line. To add a second paragraph *inside* a list item, leave a blank line and indent it to the item's text.

This doc gets both wrong. Fix it.

+++ starter
> [!TIP]
> Hold <kbd>Shift</kbd> to select.
Then press <kbd>Delete</kbd>.

- First item
- Second item
A second paragraph in the second item.

+++ learn
Laziness exists so hard-wrapped text works: you can write a long list item over several lines without indenting each one.

The flip side is that a missing blank line silently merges things. If something ends up inside a quote or list that shouldn't be, look for a missing blank line above it.

+++ sheet
> A quote

Plain text, after a blank line.

- An item

  Second paragraph, indented.

+++ tip
Plain text straight after a quote or item lazily continues it.

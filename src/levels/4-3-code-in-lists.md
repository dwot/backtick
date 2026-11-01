---
id: code-in-lists
chapter: 4
order: 3
kind: fix
title: Code inside lists
skills: fenced code, nested lists, indentation
---
## Installation

1. Clone the repository
2. Install dependencies:

   ```bash
   npm install
   ```

3. Start the dev server with `npm run dev`

+++ card
A code block can live *inside* a list item. Indent the whole fence to line up with the item's text, which is 3 spaces for `1. `:

````md
1. Install:

   ```bash
   npm install
   ```

2. Next step
````

Without the indent, the fence ends the list, and the next item starts a brand-new list. Fix this doc.

+++ starter
## Installation

1. Clone the repository
2. Install dependencies:

```bash
npm install
```

3. Start the dev server with `npm run dev`

+++ learn
Notice the broken version still *looked* numbered: the new list started at 3. Mistakes like this slip into many READMEs, and they show up when someone copies the steps.

The same indentation rule applies to paragraphs, quotes and images inside list items.

+++ sheet
1. Install:

   ```bash
   npm install
   ```

2. Run it

+++ tip
Indent the fence to the item's text, or the list restarts.

---
id: heading-links
chapter: 7
order: 3
kind: lesson
title: Links to headings
skills: anchors, links, table of contents
---
## Contents

- [Getting started](#getting-started)
- [Writing levels](#writing-levels)
- [FAQ & troubleshooting](#faq--troubleshooting)

+++ card
GitHub gives every heading an anchor, so you can link to sections with `#slug`. To get the slug:

1. lowercase everything
2. remove punctuation (except `-` and `_`)
3. turn each space into `-`

```md
## Quick Start!   →   [Quick Start!](#quick-start)
```

This time the clues won't tell you the slugs. Work them out from each link's text.

+++ learn
Removing `&` from "FAQ & troubleshooting" leaves **two** spaces in a row, so the slug gets two hyphens: `#faq--troubleshooting`. That trips up a lot of hand-written tables of contents.

If two headings have the same text, the second gets `-1` on its slug, the third `-2`, and so on. GitHub also builds a contents menu automatically from the outline button at the top of every README.

+++ sheet
## Quick Start!

[Jump to it](#quick-start)

+++ tip
Slug: lowercase, drop punctuation except `-` and `_`, spaces become `-`.

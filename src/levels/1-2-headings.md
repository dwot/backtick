---
id: headings
chapter: 1
order: 2
kind: lesson
title: Headings
skills: headings
---
# backtick

## Install

### Requirements

You need Node 22 or newer.

+++ card
Start a line with `#` for a heading. The number of `#` characters (1 to 6) sets the level:

```md
# Project name
## Section
### Subsection
```

The **space** after the `#`s is required: `#Title` is just a paragraph.

+++ learn
By convention a README has **one H1** (the project name) and uses H2s for sections.

GitHub gives every heading an anchor, so `## Install` can be linked as `#install`. You'll use that in chapter 7.

You may also see H1/H2 written by underlining with `===` or `---`. It works, but `#` is far more common.

+++ sheet
# Title
## Section
### Subsection

+++ tip
The space after `#` is required: `#Title` is just text.

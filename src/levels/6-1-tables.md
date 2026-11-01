---
id: tables
chapter: 6
order: 1
kind: lesson
title: Tables
skills: tables
---
| Command | Description |
| --- | --- |
| `check` | Compare your markdown to the target |
| `peek` | Show the live preview |

+++ card
A GitHub table needs a header row, then a **delimiter row** of `---` cells, then the body:

```md
| Name | Role |
| --- | --- |
| Ada | Engineer |
```

The pipes don't need to line up. That's purely cosmetic, and the outer pipes are optional too.

+++ learn
Lining up the pipes makes the source prettier but painful to edit. Most people let an editor extension or formatter (like Prettier) handle it.

A table needs at least the header and the delimiter row. Body rows are optional.

+++ sheet
| Name | Role |
| --- | --- |
| Ada | Engineer |

+++ tip
Pipes don't need to line up.

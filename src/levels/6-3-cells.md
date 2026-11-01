---
id: table-cells
chapter: 6
order: 3
kind: lesson
title: Inside a cell
skills: tables, inline code, escaping
---
| Syntax | Result |
| --- | --- |
| `**bold**` | **bold** |
| `[link](url)` | [link](https://example.com) |
| `a \| b` | a \| b |

+++ card
Cells can hold any **inline** formatting: bold, code, links, images.

A literal pipe would end the cell, so escape it as `\|`. In a table that's needed even *inside* inline code:

```md
| `a \| b` | a \| b |
```

+++ learn
Cells can't hold block content like lists, code blocks or multiple paragraphs. On GitHub, `<br>` gives you a line break inside a cell.

If a table needs more than that, it probably wants to be a list or a few headings instead.

+++ sheet
| Inline | Pipe |
| --- | --- |
| **bold** | `a \| b` |

+++ tip
Escape `|` as `\|` in a cell, even inside code.

---
id: fix-table
chapter: 6
order: 4
kind: fix
title: Fix the table
skills: tables, alignment
---
## Exit codes

| Code | Meaning |
| ---: | --- |
| 0 | Everything matched |
| 1 | Some blocks differ |
| 2 | Couldn't read the file |

+++ card
Without its **delimiter row**, a table is just a paragraph full of pipes. Each delimiter cell can carry an alignment colon.

This table is missing its delimiter row. Fix it, and match the target's alignment.

+++ starter
## Exit codes
| Code | Meaning |
| 0 | Everything matched |
| 1 | Some blocks differ |
| 2 | Couldn't read the file |

+++ learn
The delimiter row needs one cell per header cell. If they don't match, GitHub doesn't render a table at all.

Body rows are more forgiving: missing cells are left empty and extra cells are dropped.

+++ sheet
| Price |
| ---: |
| $5 |

+++ tip
No delimiter row, no table: just a paragraph full of pipes.

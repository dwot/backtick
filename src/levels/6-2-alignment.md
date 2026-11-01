---
id: table-alignment
chapter: 6
order: 2
kind: lesson
title: Column alignment
skills: tables, alignment
---
| Browser | Supported | Since |
| :--- | :---: | ---: |
| Firefox | yes | 115 |
| Chrome | yes | 109 |
| Safari | partly | 16.4 |

+++ card
Colons in the delimiter row set each column's alignment:

```md
| Left | Center | Right |
| :--- | :----: | ----: |
```

No colon means the default, which is left.

+++ learn
Right-align numbers so their digits line up. Center short status values like "yes" and "no".

Alignment applies to the whole column, header included.

+++ sheet
| Left | Center | Right |
| :--- | :---: | ---: |
| a | b | c |

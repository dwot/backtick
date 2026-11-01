---
id: inline-html
chapter: 7
order: 1
kind: lesson
title: Strikethrough & inline HTML
skills: strikethrough, kbd, sub, sup
---
~~Requires Node 18.~~ Requires Node 22.

Press <kbd>Ctrl</kbd> + <kbd>Enter</kbd> to check.

Water is H<sub>2</sub>O and E = mc<sup>2</sup>.

+++ card
Strike text out with double tildes, a GitHub extra:

```md
~~old news~~
```

GitHub also allows a few **inline HTML tags** for things markdown has no syntax for:

```md
<kbd>Ctrl</kbd>   keyboard keys
H<sub>2</sub>O    subscript
x<sup>2</sup>     superscript
```

+++ learn
Strikethrough is great in changelogs and docs for showing what *changed* rather than silently deleting it.

GitHub strips anything risky (scripts, styles, most attributes), but tags like `<kbd>`, `<sub>`, `<sup>`, `<br>`, `<img>` and `<details>` are allowed.

+++ sheet
~~old~~ <kbd>Ctrl</kbd>+<kbd>C</kbd> H<sub>2</sub>O x<sup>2</sup>

---
id: emphasis
chapter: 1
order: 3
kind: lesson
title: Bold & italic
skills: bold, italic
---
Markdown is **simple**, *flexible*, and ***everywhere***.

+++ card
Wrap text in asterisks to emphasize it:

```md
*italic*   **bold**   ***bold italic***
```

Underscores work too: `_italic_` and `__bold__` render the same, so either one counts here.

+++ learn
One difference between them: underscores **don't** work inside a word, so `snake_case_name` stays plain text. That's why underscores are safe in dev docs. Asterisks do work mid-word: `un**believ**able`.

~~Strikethrough~~ is a GitHub extra; it comes up in chapter 7.

+++ sheet
*italic* or _italic_, **bold**, ***both***

---
id: code-fences
chapter: 4
order: 1
kind: lesson
title: Code blocks
skills: fenced code
---
Install it globally:

```
npm install -g backtick
backtick --version
```

+++ card
For multi-line code, put three backticks on their own line before and after:

````md
```
line one
  indented line two
```
````

Everything inside is shown exactly as typed, including spaces and characters that would otherwise be markdown.

+++ learn
Three tildes (`~~~`) work as a fence too.

You may see code blocks made by indenting every line with **4 spaces**. That's legal, but it can't take a language and is easy to trigger by accident. Fences are clearer.

+++ sheet
```
Shown  exactly
  as typed, *even this*
```

---
id: code-backticks
chapter: 4
order: 4
kind: lesson
title: Backticks inside code
skills: fenced code, inline code
---
To show a code block in your docs, write:

````md
```js
console.log("hi");
```
````

Inline, wrap it in double backticks: `` `npm test` ``.

+++ card
To put a fence *inside* a code block, make the outer fence longer, or switch to tildes:

`````md
````md
```js
code
```
````
`````

Inline code works the same way: use more backticks on the outside than appear inside, plus a space: ``` `` `x` `` ```.

+++ learn
The rule is simply "the closing fence must match the opening one", so a longer fence can contain shorter ones.

`~~~` fences are often easier to read when the content is full of backticks.

+++ sheet
````md
```js
code
```
````

+++ tip
The outer fence needs more backticks than the inner one (or use `~~~`).

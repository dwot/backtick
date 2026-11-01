---
id: code-languages
chapter: 4
order: 2
kind: lesson
title: Syntax highlighting
skills: fenced code, languages
---
Config lives in `backtick.json`:

```json
{
  "hardMode": true,
  "theme": "dark"
}
```

Or set it from code:

```ts
import { configure } from "backtick";
```

+++ card
Name a language right after the opening fence, and GitHub highlights the code:

````md
```js
console.log("hi");
```
````

The language isn't visible in the render, so it's listed under the target.

+++ learn
Handy languages for READMEs: `bash` / `sh`, `json`, `yaml`, `ts` / `js`, `py`, `diff` and `console`.

`diff` colors lines starting with `+` and `-`, which is great for changelogs and migration guides. `console` is for shell sessions that show a `$` prompt and output.

+++ sheet
```js
console.log("hi");
```

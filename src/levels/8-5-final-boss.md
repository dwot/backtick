---
id: final-boss
chapter: 8
order: 5
kind: boss
title: The whole README
skills: everything
---
# backtick

[![build](https://img.shields.io/badge/build-passing-brightgreen)](https://github.com/backtick/backtick/actions) [![license](https://img.shields.io/badge/license-MIT-blue)](LICENSE)

Learn markdown by recreating it, one level at a time.\
Press <kbd>Ctrl</kbd> + <kbd>Enter</kbd> to check.

> [!TIP]
> Solve a level without peeking to earn three stars.

## Contents

- [Install](#install)
- [Usage](#usage)
- [Roadmap](#roadmap)

## Install

```bash
npm install -g backtick
```

## Usage

| Command | What it does |
| :--- | :--- |
| `backtick play` | Start the course |
| `backtick check <file>` | Check a file |

<details>
<summary>How is it scored?</summary>

Each check colors your blocks: green for exact, yellow for close.[^1]

</details>

## Roadmap

- [x] Chapters 1 to 8
- [ ] Terminal version

---

Built on [unified][unified].

[unified]: https://unifiedjs.com
[^1]: Gray means the block is missing.

+++ learn
**You finished the course.** That README uses nearly everything in GitHub Flavored Markdown that you'll meet day to day.

Go back for any missing stars: replaying levels without the preview is where this really sticks.

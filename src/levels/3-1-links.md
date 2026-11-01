---
id: links
chapter: 3
order: 1
kind: lesson
title: Links
skills: links
---
## Contributing

Read the [contributing guide](CONTRIBUTING.md) before opening a PR, or browse the [**issue tracker**](https://github.com/backtick/backtick/issues).

+++ card
A link is the text in square brackets, then the URL in parentheses:

```md
[link text](https://example.com)
```

The URL can be relative, like `docs/setup.md`, and the text can contain formatting: `[**bold link**](url)`.

Link URLs aren't visible in the render, so they're listed under the target.

+++ learn
On GitHub, **relative links** resolve to files in the repo, so `[guide](CONTRIBUTING.md)` keeps working on forks and branches. Prefer them to full URLs for your own files.

An optional title in quotes shows on hover: `[text](url "Title")`.

+++ sheet
[Docs](https://example.com) and [Setup](docs/setup.md)

+++ tip
No space between `]` and `(`.

---
id: reference-links
chapter: 3
order: 4
kind: fix
title: Reference links
skills: reference links
---
See the [changelog][changelog] for what's new, the [roadmap][] for what's next, and [file a bug][issues] if something breaks.

[changelog]: CHANGELOG.md
[roadmap]: https://github.com/backtick/backtick/projects/1
[issues]: https://github.com/backtick/backtick/issues

+++ card
**Reference links** keep long URLs out of your sentences. Give the link a label, then define it anywhere in the file:

```md
Read the [docs][d] or the [FAQ][].

[d]: https://example.com/docs
[faq]: https://example.com/faq
```

`[FAQ][]` uses the link text as the label. Labels aren't case-sensitive. A definition needs the colon: `[label]: url`.

Two of this doc's link **definitions** are broken, and that breaks all three links. Fix them.

+++ starter
See the [changelog][changelog] for what's new, the [roadmap][] for what's next, and [file a bug][issues] if something breaks.

[change-log]: CHANGELOG.md
[roadmap] https://github.com/backtick/backtick/projects/1
[issues]: https://github.com/backtick/backtick/issues

+++ learn
A reference to a label that isn't defined renders as **literal text**, brackets and all. That's the telltale sign of a broken reference link.

A malformed definition is just text, and a definition can't interrupt a paragraph. That's why the line *after* the broken `[roadmap]` line got swallowed too.

Definitions never render, so many READMEs gather them at the bottom, out of the way. They work for images too: `![logo][logo]`.

+++ sheet
Read the [docs][d] or the [FAQ][].

[d]: https://example.com/docs
[faq]: https://example.com/faq

+++ tip
Labels ignore case. Definitions need the colon.

---
id: autolinks
chapter: 3
order: 2
kind: lesson
title: Autolinks
skills: autolinks, links
---
Docs live at https://backtick.dev and the source at <https://github.com/backtick/backtick>.

Questions? Email <hello@backtick.dev>.

+++ card
When the link text *is* the URL, you don't need `[text](url)`. Wrap it in angle brackets:

```md
<https://example.com>
<someone@example.com>
```

GitHub goes further and links **bare** URLs and emails automatically: `https://example.com` just works.

+++ learn
Angle brackets work in every markdown renderer. Bare-URL linking is a GitHub Flavored Markdown extension.

GitHub is smart about trailing punctuation: in `see https://example.com.` the final `.` isn't part of the link.

+++ sheet
<https://example.com> and <hi@example.com>

+++ tip
GitHub also links bare URLs.

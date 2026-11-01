---
id: details
chapter: 7
order: 4
kind: lesson
title: Collapsible sections
skills: details, summary, inline html
---
<details>
<summary>Why not use a WYSIWYG editor?</summary>

Because READMEs live in git, and plain-text diffs are **easy** to review.

</details>

+++ card
`<details>` hides content until it's clicked. `<summary>` is the clickable label:

```md
<details>
<summary>Click me</summary>

Hidden **markdown** goes here.

</details>
```

Leave **blank lines** around the hidden content, or the markdown inside won't render. Click the target to see what's inside.

+++ learn
Great for long logs, optional details and FAQ answers. Your README stays short, and the details are still one click away.

Add `open` to start expanded: `<details open>`.

+++ sheet
<details>
<summary>Click me</summary>

Hidden **markdown**.

</details>

+++ tip
Blank lines around the hidden content, or the markdown won't render.

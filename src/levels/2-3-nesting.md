---
id: nesting
chapter: 2
order: 3
kind: fix
title: Nested lists
skills: nested lists, indentation
---
## Setup

1. Install the tools:
   - Node 22
   - `pnpm`
2. Clone the repo
3. Copy the env file:
   - from `.env.example`
   - to `.env.local`

+++ card
To nest a list, indent it so it lines up with the **text** of the item above, not its marker:

```md
- Parent
  - Child (2 spaces)

1. Parent
   - Child (3 spaces)
```

Too little indentation and the "child" becomes a separate list instead. This doc has exactly that bug. Fix it.

+++ starter
## Setup

1. Install the tools:
- Node 22
- `pnpm`
2. Clone the repo
3. Copy the env file:
  - from `.env.example`
  - to `.env.local`

+++ learn
The rule is "line up with the item's content". For `1. ` that's 3 spaces, and for `10. ` it's 4.

Tabs work but behave inconsistently between tools. Spaces are the safe choice.

+++ sheet
- Parent
  - Child, lined up with the text

1. Step
   - Three spaces under `1. `

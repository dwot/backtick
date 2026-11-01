---
id: code-boss
chapter: 4
order: 5
kind: boss
title: A usage section
skills: fenced code, languages, code in lists, inline code
---
## Usage

Run the CLI against a file:

```bash
backtick check README.md
```

### Options

1. Pass `--fix` to rewrite the file in place
2. Pass `--config` with a file like:

   ```json
   { "strict": true }
   ```

The output looks like this:

```console
$ backtick check README.md
ok: 12 blocks match
```

+++ learn
That's chapter 4: fences, languages, code inside lists, and nesting backticks.

Next up: **quotes and structure**, including the GitHub alerts you've probably seen in the wild.

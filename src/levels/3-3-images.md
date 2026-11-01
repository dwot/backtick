---
id: images
chapter: 3
order: 3
kind: lesson
title: Images
skills: images
---
## Screenshot

![The Backtick level screen](docs/screenshot.svg)

Made with ![Backtick logo](docs/logo.svg) and coffee.

+++ card
An image is a link with a `!` in front. The bracket text becomes the **alt text**:

```md
![A cat asleep on a keyboard](images/cat.png)
```

Alt text is read by screen readers and shown if the image fails to load, so describe what's in the picture. Images can also sit inline in a sentence.

+++ learn
Put an image *inside* a link and it becomes clickable. That's how README **badges** work:

```md
[![build](https://img.shields.io/badge/build-passing-green)](https://ci.example.com)
```

Markdown can't size images. On GitHub, use HTML instead: `<img src="logo.png" width="120">`.

+++ sheet
![Logo of a backtick](docs/logo.svg) inline images work too

+++ tip
Alt text should describe the picture.

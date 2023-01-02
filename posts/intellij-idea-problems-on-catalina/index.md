---
title: 'IntelliJ Idea Cannot Open Project on Catalina Beta 5'
date: '2019-08-18'
spoiler: IntelliJ Idea Cannot Open Project on Catalina, IntelliJ Idea 无法在 Catalina Beta 5 上打开项目
---

Just upgrade my IntelliJ Idea to the latest version, 2019.02, then everything breaks.
You cannot open any recent projects or folders, nothing happens.
First thing first, here is the workaround:

```
-Dide.mac.file.chooser.native=false
```

in Help | Edit Custom VM Options and restart the IDE, which disable using native file chooser.

![Editor VM Options](https://miro.medium.com/max/1400/1*7cfCco8bbueYVkQ6BuUbHg.png)

It’s a bug of Catalina, NSSavePanel doesn’t call completionHandler on exit.

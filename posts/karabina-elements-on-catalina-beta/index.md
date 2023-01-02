---
title: 'OS X Catalina Beta 3 修复 Karabiner'
date: '2019-08-18'
spoiler: OS X Catalina Beta 3 修复 Karabiner
---

为了尝试下 SwiftUI，升到了 Catalina Beta 3， 基本都没什么问题，只是 Karabiner 这个软件不正常了。 Karabiner
是用来修改键位的，我把 Capslock 键键值修改为 F19， 再把 F19 设置为启动 Alfred 的热键，等于连用习惯的 Alfred 也废了～

由于 Catalina 改了安全策略，变得更加严格，因此猜测是权限隐私问题，赋予 Karabiner 相应的权限，应该就能解决问题。

把 Karabiner-Elements 路径下的 grabber 和 observer 加到

    /Library/Application Support/org.pqrs/Karabiner-Elements/bin

隐私和安全下面的 Input Monitering

![Security and Privacy](https://cdn-images-1.medium.com/max/1600/1*lsXLMYB9GiB8WeDKyIDM4A.png)

再重启 Karabiner，就恢复功能了。

```
    sudo kill karabiner_grabber karabiner_observer
```

- [Karabiner Elements](https://medium.com/tag/karabiner-elements?source=post)
- [Catalina](https://medium.com/tag/catalina?source=post)
- [Beta](https://medium.com/tag/beta?source=post)
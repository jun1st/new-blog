---
title:  Zsh 插件之 Terminal 代理插件 zsh-proxy 
date: '2022-04-30'
spoiler: Zsh 插件之 Terminal 代理插件 zsh-proxy 推荐，单独给 terminal 设置代理，shell，git 代理。 
---

今天推荐一个 Terminal 的代理插件，[zsh-proxy](https://github.com/SukkaW/zsh-proxy)， 

Clone 仓库完成安装，

```shell
git clone https://github.com/sukkaw/zsh-proxy.git ~/.oh-my-zsh/custom/plugins/zsh-proxy
```


在 .zshrc 文件中配置插件，

```shell
plugins=(
    [plugins
     ...]
    zsh-proxy
)
```

# 使用

## init_proxy

init_proxy 初始化插件配置文件， 命令行会在 ~/.zsh-proxy 目录下创建 http，https，socks 文件，

## config_proxy

配置 http，https 和 socks5 的 代理，也可以配置代理白名单

## proxy

启动 proxy 代理，

## noproxy

关闭代理，简单好用


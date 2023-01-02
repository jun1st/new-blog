---
title: '发布你的第一个 Maven Jar 库到 Maven 中央仓库'
date: '2018-11-01'
spoiler: 发布你的第一个 Maven Jar 库到 Maven 中央仓库, publish your first jar to maven central 
---

## 发布你的第一个 Jar 到 Maven 中央仓库

如果你写 Java，那么肯定离不开 Maven。使用了那么多别人开源共享的代码，有没有想自己也贡献一个呢？把代码开源到 Github 是第一步，打包成 Jar
文件发布到 Maven 中央仓库，才是最关键的一步。而这一步并不简单，我花了不少时间才成功发布自己的第一个库。

### 注册账号

首先在网站 [https://issues.sonatype.org/](https://issues.sonatype.org/)
上注册个账号。登录成功之后，点击导航栏中间大大的那个 Create

Project 记得选 Community Support — Open Source Project Repository Hosting

![](https://cdn-images-1.medium.com/max/1600/1*9_RxeT0uDEd6IGfM0LCCQA.png)

红色星标的都需要填写。

注意 GroupId 可以直接用 com.github.userId。如果想用自己的域名，比如 me.fengqijun.xxx, 是完全没有问题的，只是在你的
issue 提交之后会要求你从相应的域名邮箱发个邮件到一个指定的地址，以确认域名所有权。

Project URL 和 SCM URL 填 Github 地址就好了

### 申请被批准

当你创建的 Issue 状态变成 Resolved 之后，就可以准备发布代码了。通常 Issue
处理得还是蛮及时的，一般一天时间就会被处理（别人的工作时间是我们的晚上）。

![](https://cdn-images-1.medium.com/max/1600/1*z7njcEGzT0E2nGTcwKxrWg.png)

### 发布代码到中央仓库

首先需要安装 GPG 用来对代码进行签名，如果是在 mac 上，可以直接用 homebrew 进行安装。如果是 windows，可以去
[https://www.gpg4win.org/](https://www.gpg4win.org/) 下载

在 maven 的 setting.xml 文件中添加

```xml
      <servers>
        <server>
          <id>sonatype-nexus-snapshots</id>
          <username>Sonatype 账号</username>
          <password>Sonatype 密码</password>
        </server>
        <server>
          <id>sonatype-nexus-staging</id>
          <username>Sonatype 账号</username>
          <password>Sonatype 密码</password>
        </server>
      </servers>
```

然后在 pom 文件中添加相关设置

```xml
    <licenses>
        <license>
            <name>Apache License, Version 2.0</name>
            <url>http://www.apache.org/licenses/LICENSE-2.0</url>
        </license>
    </licenses>
    <developers>
        <developer>
            <name>fengde</name>
            <email>jun1st.feng@gmail.com</email>
        </developer>
    </developers>
    <scm>
        <tag>master</tag>
        <url>https://github.com/jun1st/master-slave-datasource.git</url>
        <connection>scm:git:https://github.com/jun1st/master-slave-datasource.git</connection>
        <developerConnection>scm:git:https://github.com:jun1st/master-slave-datasource.git</developerConnection>
    </scm>
    <parent>
        <groupId>org.sonatype.oss</groupId>
        <artifactId>oss-parent</artifactId>
        <version>7</version>
    </parent>
```

用 GPG 签名

```bash
    gpg --gen-key
```

生成你自己的签名，要记住需要你输入的 passphrase

然后执行

```bash
    mvn clean deploy -P sonatype-oss-release
```

发布过程中会需要你输入刚刚生成签名时的 passphrase。如果你在 mac 上执行碰到不能输入的问题，需要配置 `export GPG_TTY=$(tty)`

完成之后你的 jar 包已经上传到了 maven 的一个仓库，不过别人还不能用。这个时候你应该把你刚才用来加密的密钥上传到一个公共的地方供别人来校验

执行命令

```bash
    gpg — list-keys
```

然后你会看到有一个 pub 的值。 然后执行下方命令:

```bash
    gpg --keyserver hkp://keyserver.ubuntu.com:11371 --send-keys xxxxxxx
```

再访问地址
[https://oss.sonatype.org/#stagingRepositories](https://oss.sonatype.org/#stagingRepositories),
用你一开始的时候注册的用户名登录。在最下方应该能找到你刚刚提交的 jar 包。

选择之后先 close，close 之后如果没问题的话接着点击 release。当然，如果有问题的话可能就是你上传过程中出现了什么问题，如果解决不了欢迎在博客下方提问。

再访问
[https://issues.sonatype.org/secure/Dashboard.jspa](https://issues.sonatype.org/secure/Dashboard.jspa)
会发现多了一条评论

![](https://cdn-images-1.medium.com/max/1600/1*9bHUuauE1aei4IctzPEN5A.png)

看到这个评论，就是发布成功了。 哈利路亚～
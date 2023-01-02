---
title: 'Clickhouse 系列 1 之入门'
date: '2019-08-23'
spoiler: Clickhouse 系列 1 之入门
---


## 什么是 ClickHouse？

ClickHouse 是一个用于联机分析(OLAP)的列式数据库管理系统(DBMS)。

在传统的行式数据库系统中,处于同一行中的数据总是被物理的存储在一起。在列式数据库中，数据库总是将同一列的数据存储在一起，不同列的数据也总是分开存储。

不同的存储方式适合不同的场景，这里的查询场景包括： 进行了哪些查询，多久查询一次以及各类查询的比例； 每种查询读取多少数据————行、列和字节；读取数据和写入数据之间的关系；使用的数据集大小以及如何使用本地的数据集；是否使用事务,以及它们是如何进行隔离的；数据的复制机制与数据的完整性要求；每种类型的查询要求的延迟与吞吐量等等。

系统负载越高，根据使用场景进行定制化就越重要，并且定制将会变的越精细。没有一个系统同样适用于明显不同的场景。如果系统适用于广泛的场景，在负载高的情况下，所有的场景可以会被公平但低效处理，或者高效处理一小部分场景。

### OLAP 场景的关键特征

- 大多数是读请求
- 数据总是以相当大的批(> 1000 rows)进行写入
- 不修改已添加的数据
- 每次查询都从数据库中读取大量的行，但是同时又仅需要少量的列
- 宽表，即每个表包含着大量的列
- 较少的查询(通常每台服务器每秒数百个查询或更少)
- 对于简单查询，允许延迟大约 50 毫秒
- 列中的数据相对较小： 数字和短字符串(例如，每个 URL 60 个字节)
- 处理单个查询时需要高吞吐量（每个服务器每秒高达数十亿行）
- 事务不是必须的
- 对数据一致性要求低
- 每一个查询除了一个大表外都很小
- 查询结果明显小于源数据，换句话说，数据被过滤或聚合后能够被盛放在单台服务器的内存中

很容易可以看出，OLAP 场景与其他流行场景(例如,OLTP 或 K/V)有很大的不同， 因此想要使用 OLTP 或 Key-Value 数据库去高效的处理分析查询是没有意义的，例如，使用 OLAP 数据库去处理分析请求通常要优于使用 MongoDB 或 Redis 去处理分析请求。

## 第一次安装测试 clickhouse

首次安装测试，用 docker 来得最方便了，yandex 提供了官方的 docker 镜像

```bash
mkdir $HOME/some_clickhouse_database
docker run -d --name some-clickhouse-server --ulimit nofile=262144:262144 --volume=$HOME/some_clickhouse_database:/var/lib/clickhouse yandex/clickhouse-server
```

这里指定了本地的一个目录，加载到 docker 容器环境里来存储数据。因为 clickhouse 用到的测试数据一般都比较多，倒入测试数据是一项比较重的工作，因此最好保存在本地，而不依赖于容器环境。

容器启动之后，怎么访问呢？ 最简单的就是进入这个容器的环境，运行 clickhouse-client

```bash
docker exec -it some-clickhouse-server bash
```

进入容器之后，来到 /etc/clickhouse-server/ 目录下，把 config.xml 复制到本地计算机上，然后在本地修改这个文件，取消注释这行配置，开启主机监听，方便通过 GUI 程序来访问。

```bash
<listen_host>0.0.0.0</listen_host>
```

把原来的容器删了，加载在本地的配置文件，

```bash
docker run -d --name clickhouse-server --ulimit nofile=262144:262144 --volume=$HOME/clickhouse_database:/var/lib/clickhouse  -v ~/Documents/clickhouse/config.xml:/etc/clickhouse-server/config.xml yandex/clickhouse-server
```

### 安装 Tabix 来连接管理 clickhouse

Tabix 是这次我选用的管理工具，他是一个 web 站点，安装和使用都比较简单，甚至可以作为 clickhouse 的内嵌使用， UI 界面也同样优秀。 我在本机还是使用最方便的 docker 容器来跑。

```bash
docker run -d -p 8080:80 spoonest/clickhouse-tabix-web-client
```

在本机访问 localhost:8080, 默认用户名 defaut，密码为空，

![tabix ui](/static/assets/images/tabix-ui.png)

开始吧
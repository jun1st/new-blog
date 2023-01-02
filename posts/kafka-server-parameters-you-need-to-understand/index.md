---
title: Key Kafka Parameters You Need To Understand
date: '2020-05-18'
spoiler: 搭建 Kafka 集群时，需要考虑的除了硬件和服务器设置，当然还有 Kafka 本身。本文介绍一下需要掌握的最关键的 Kafka 参数
---

## 关键 Kafka 参数

`broker.id`: 每个 Kafka Broker 都需要有一个唯一的 Id

`port`: 这是 Kafka 监听的端口，也就是客户端使用的端口

`zookeeper.connect`: 这是 zookeeper 的地址，

`log.dirs`: 这个是 Kafka 存储数据的地方

`auto.create.topics.enable`: 是否允许自动创建 topic

## 关键 Topic 参数

`num.partitions`: 一个 topic 有几个 partitions。 默认参数是 1。 Partition 的数量，决定了这个 topic 的性能，当然这个不是越多越好，跟整个集群的 broker 的数量和这个 topic 的吞吐量有关

`log.retention.ms`: 这个参数决定了被写到硬盘种的消息数据会被保存多久。 同样的参数还有 `log.retention.minutes` 和 ` log.renention.hours`。 单位小的优先级高， 就是说 `log.retention.ms` > `log.retention.minutes` > `log.retention.hours`

`log.retention.bytes`: 这个参数和上面的参数功能类似，决定了写到磁盘的历史消息保留多久。 需要注意的是本参数的对象是 partition， 如果 `log.retention.bytes` 设置为 1GB， 这个 topic 有8个 partition，那么这个 topic 最多可能存储 8 个 GB 的数据。


`log.segment.bytes`: 当一个消息被写到磁盘上时，消息会被追加到当前的 log 文件上，这个文件叫做一个 log segment。 当一个 log segment 达到设置的容量上限时，默认为 1 GB。 当前的 log 文件就会被关闭，一个新的 log 文件会被创建。只有当一个 log 文件被认为是关闭时，前面设置的 retention 才会起作用，才可能会被认为过期。 因此这个 segment bytes 非常重要。 比如一个 topic 一天收到 100 MB 的消息数据。那么 10 天会填满一个 segment， 10 天之后这个 segment 会关闭。关闭7天之后，这个 segment 可以被 retired， 因此总的存在时间会是 17 天。

`log.segment.ms`: 这个设置确定了一个 segment，多久时间之后可以背关闭。 这个和上面的 bytes 两者是或者的关系，只要其中一个条件满足，这个 log segment 就可以被关闭，等待 retired

`message.max.bytes`: 这个是每条消息最大的允许的字节数，超过这个字节 kafka 会报异常给客户端。默认的大小是 1 MB。
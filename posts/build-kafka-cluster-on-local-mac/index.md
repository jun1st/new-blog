---
title: 'Build kafka cluster on local mac'
date: '2019-12-29'
spoiler: 在 Mac 本机上部署 Kafka 集群，用 kafka manager 来查看 kafka 状态.
---

## 下载 Kafka

通过 Kafka 官网下载最新的 Kafka， Kafka 的版本更新还是蛮保守传统的，目前还是 2.4.0 的版本。 但是解压包文件，解压出来的文件夹是 kafka_2.12-2.4.0, 什么 2.12？
其实这是使用的 Scala 的版本，2.4.0 才是当前的 Kafka 的版本

## 集群配置

Kafka 的关键配置 server.properties

```xml
broker.id=1
listeners=PLAINTEXT://:9090
log.dirs=/tmp/kafka-logs
num.partitions=3
offsets.topic.replication.factor=3
zookeeper.connect=localhost:2181
```

设置每个 Topic 的 partitions 数为 3，并且设置 offsets 的 replication factor 为 3。

创建一个 server-1.properties 和 server-2.properties 文件， 因为在本地机器上，部署一个假的 Kafka 集群，所有需要修改的值有 broker.id, listeners, log.dirs,
不同的 broker，在本机上配置不同的 log 目录。

## 开启 Kafka 集群

先开启 zookeeper, 进入 Kafka 目录，

```bash
bin/zookeeper-server-start.sh config/zookeeper.properties
```

在依次开启三个 Kafka 实例。

```bash
bin/kafka-server-start.sh config/server.properties
bin/kafka-server-start.sh config/server-1.properties
bin/kafka-server-start.sh config/server-2.properties
```

应该开启成功了三个 Kafka 实例。 在这里没有以 daemon 的模式开启 Kafka，是想能实时的看到运行的 log。 我们来看下 Kafka 中的 Topic 数据。

```bash
bin/kafka-topics.sh --bootstrap-server localhost:9092 --list
## __consumer_offsets
```

只有一个 topic， \_\_consumer_offsets, 这个 topic 是 kafka 默认创建的。 来看下这个 topic 的一些属性，

```bash
bin/kafka-topics.sh --bootstrap-server localhost:9092 --describe __consumber_offsets
## Topic: __consumer_offsets	PartitionCount: 50	ReplicationFactor: 1	Configs: compression.type=producer,cleanup.policy=compact,segment.bytes=104857600
```

可以看到这个 Topic 的 50 个分区数据，但是 replication 数却是 1。 这个 1 意味着前面的分区数据，只会存在于一个 broker 中，如果某一个 broker 坏了，那么存在这个 broker 中的分片数据，
就不可用。

### 修改 consumer_offsets Replication 数

修改 consumer_offsets 的 replication factor，需要用到 kafka 的 reassignment 功能， 这时需要自己提供一个 assignment json 文件。

```jsxon
{
  "version": 1,
  "partitions": [
    { "topic": "__consumer_offsets", "partition": 0, "replicas": [1, 2, 3] },
    { "topic": "__consumer_offsets", "partition": 1, "replicas": [1, 2, 3] },
    { "topic": "__consumer_offsets", "partition": 2, "replicas": [1, 2, 3] },
    ...
  ]
}
```

完整的 json 文件可以在这里下载： [gist](https://gist.github.com/jun1st/31aaf1ebe6c93c4a11079073512a9c30)

执行修改：

```bash
bin/kafka-reassign-partitions.sh --zookeeper localhost:2181 --reassignment-json-file __consumer_offsets.json --execute
```

执行完毕，再用 describe 查看 topic 信息

```bash
bin/kafka-topics.sh --bootstrap-server localhost:9092 --describe __consumber_offsets
# Topic: __consumer_offsets	PartitionCount: 50	ReplicationFactor: 3	Configs: compression.type=producer,cleanup.policy=compact,segment.bytes=104857600
```

执行成功，

这时，你关掉一个 kafka 实例，停掉一个 broker，并不会看到有报错信息，而是会看到 kafka 的 rebalance log，

```bash
[2019-12-29 21:53:09,341] INFO [GroupMetadataManager brokerId=1] Finished loading offsets and group metadata from __consumer_offsets-23 in 0 milliseconds. (kafka.coordinator.group.GroupMetadataManager)
[2019-12-29 21:53:09,341] INFO [GroupMetadataManager brokerId=1] Finished loading offsets and group metadata from __consumer_offsets-26 in 0 milliseconds. (kafka.coordinator.group.GroupMetadataManager)
[2019-12-29 21:53:09,341] INFO [GroupMetadataManager brokerId=1] Finished loading offsets and group metadata from __consumer_offsets-29 in 0 milliseconds. (kafka.coordinator.group.GroupMetadataManager)
[2019-12-29 21:53:09,341] INFO [GroupMetadataManager brokerId=1] Finished loading offsets and group metadata from __consumer_offsets-32 in 0 milliseconds. (kafka.coordinator.group.GroupMetadataManager)
[2019-12-29 21:53:09,341] INFO [GroupMetadataManager brokerId=1] Finished loading offsets and group metadata from __consumer_offsets-35 in 0 milliseconds. (kafka.coordinator.group.GroupMetadataManager)
[2019-12-29 21:53:09,341] INFO [GroupMetadataManager brokerId=1] Finished loading offsets and group metadata from __consumer_offsets-38 in 0 milliseconds. (kafka.coordinator.group.GroupMetadataManager)
[2019-12-29 21:53:09,342] INFO [GroupMetadataManager brokerId=1] Finished loading offsets and group metadata from __consumer_offsets-41 in 1 milliseconds. (kafka.coordinator.group.GroupMetadataManager)
[2019-12-29 21:53:09,342] INFO [GroupMetadataManager brokerId=1] Finished loading offsets and group metadata from __consumer_offsets-44 in 0 milliseconds. (kafka.coordinator.group.GroupMetadataManager)
[2019-12-29 21:53:09,342] INFO [GroupMetadataManager brokerId=1] Finished loading offsets and group metadata from __consumer_offsets-47 in 0 milliseconds. (kafka.coordinator.group.GroupMetadataManager)
```

再把关掉的 kafka 实例开起来，会看到新的 broker 加入 cluster 的 log

```bash
[2019-12-29 21:55:28,427] INFO [Partition __consumer_offsets-26 broker=1] ISR updated to [2,1,3] and zkVersion updated to [11] (kafka.cluster.Partition)
[2019-12-29 21:55:28,427] INFO [Partition __consumer_offsets-29 broker=1] Expanding ISR from 2,1 to 2,1,3 (kafka.cluster.Partition)
[2019-12-29 21:55:28,428] INFO [Partition __consumer_offsets-29 broker=1] ISR updated to [2,1,3] and zkVersion updated to [11] (kafka.cluster.Partition)
[2019-12-29 21:55:28,428] INFO [Partition __consumer_offsets-34 broker=1] Expanding ISR from 1,2 to 1,2,3 (kafka.cluster.Partition)
[2019-12-29 21:55:28,428] INFO [Partition __consumer_offsets-34 broker=1] ISR updated to [1,2,3] and zkVersion updated to [8] (kafka.cluster.Partition)
[2019-12-29 21:55:28,428] INFO [Partition __consumer_offsets-10 broker=1] Expanding ISR from 1,2 to 1,2,3 (kafka.cluster.Partition)
[2019-12-29 21:55:28,429] INFO [Partition __consumer_offsets-10 broker=1] ISR updated to [1,2,3] and zkVersion updated to [8] (kafka.cluster.Partition)
[2019-12-29 21:55:28,429] INFO [Partition __consumer_offsets-32 broker=1] Expanding ISR from 2,1 to 2,1,3 (kafka.cluster.Partition)
[2019-12-29 21:55:28,430] INFO [Partition __consumer_offsets-32 broker=1] ISR updated to [2,1,3] and zkVersion updated to [11] (kafka.cluster.Partition)
[2019-12-29 21:55:28,430] INFO [Partition __consumer_offsets-40 broker=1] Expanding ISR from 1,2 to 1,2,3 (kafka.cluster.Partition)
[2019-12-29 21:55:28,430] INFO [Partition __consumer_offsets-40 broker=1] ISR updated to [1,2,3] and zkVersion updated to [8] (kafka.cluster.Partition)
```

## 使用 Kafka Manager 来管理

Kafka Manager 是 Yahoo 开源的 Kafka 管理工具，在 github 上[下载](https://github.com/yahoo/kafka-manager)

在本机上，按照说明下载就好，

管理界面如下：

![kafka-manager](/posts/kafka-manager.png)

Replicas 数是 3 !!!
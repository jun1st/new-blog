---
title: Kafka 基本概念
date: '2021-01-01'
spoiler: 你需要知道的 Kafka 基本概念。 什么是消费者，什么是消费者组。 Zookeeper 在整个 Kafka 集群中起到什么作用？
---

## 消费者组

消费者组是 Kafka 独有的概念。官网上的介绍言简意赅，即消费者组是 Kafka 提供的可扩展且具有容错性的消费者机制。 

但实际上，消费者组（Consumer Group）其实包含两个概念。

作为队列，消费者组允许你分割数据处理到一组进程集合上（即一个消费者组中可以包含多个消费者进程，他们共同消费该topic的数据），这有助于你的消费能力的动态调整；

作为发布-订阅模型（publish-subscribe），Kafka允许你将同一份消息广播到多个消费者组里，以此来丰富多种数据使用场景。

通俗一点讲，一个消费者组，可以有多个消费者，是一个逻辑处理单元。 当一个组订阅一个 Topic 时， Topic 中的一条 Message， 只会被组中的某一个消费者消费。如果


## 在 Kafka 中，ZooKeeper的作用是什么？

任何分布式系统中虽然都通过一些列的算法去除了传统的关系型数据存储，但是毕竟还是有些数据要存储的，同时分布式系统的特性往往是需要有一些中间人角色来统筹集群。比如我们在整个微服务框架中的Dubbo，它也是需要依赖一些注册中心或配置中心类的中间件的，以及云原生的Kubernetes使用etcd作为整个集群的枢纽。

目前，Kafka使用ZooKeeper存放集群元数据、成员管理、Controller选举，以及其他一些管理类任务。之后，等KIP-500提案完成后，Kafka将完全不再依赖于ZooKeeper。

* “存放元数据”是指主题分区的所有数据都保存在 ZooKeeper 中，且以它保存的数据为权威，其他 “人” 都要与它保持对齐。
* “成员管理” 是指 Broker 节点的注册、注销以及属性变更，等等。
* “Controller 选举” 是指选举集群 Controller，而其他管理类任务包括但不限于主题删除、参数配置等

KIP-500 思想，是使用社区自研的基于 Raft 的共识算法，替代 ZooKeeper，实现Controller自选举。

## Kafka 能手动删除消息吗？

Kafka不需要用户手动删除消息。它本身提供了留存策略，能够自动删除过期消息。当然，它是支持手动删除消息的。

* 对于设置了 Key 且参数 cleanup.policy=compact 的主题而言，我们可以构造一条 的消息发送给 Broker，依靠 Log Cleaner 组件提供的功能删除掉该 Key 的消息。
* 对于普通主题而言，我们可以使用 kafka-delete-records 命令，或编写程序调用 Admin.deleteRecords 方法来删除消息。这两种方法殊途同归，底层都是调用 Admin 的 deleteRecords 方法，通过将分区 Log Start Offset 值抬高的方式间接删除消息。


##  ____consumer_offsets____ 是做什么用的？

这是一个内部主题，主要用于存储消费者的偏移量，以及消费者的元数据信息（消费者实例，消费者id等等）

需要注意的是：Kafka 的 GroupCoordinator 组件提供对该主题完整的管理功能，包括该主题的创建、写入、读取和 Leader 维护等。

## 分区 Leader 选举策略 

分区的 Leader 选举对用户是完全透明的，它是由 Controller 独立完成的。

* OfflinePartition Leader 选举：每当有分区上线时，就需要执行 Leader 选举。所谓的分区上线，可能是创建了新分区，也可能是之前的下线分区重新上线。这是最常见的分区Leader选举场景。
* ReassignPartition Leader 选举：当你手动运行 kafka-reassign-partitions 命令，或者是调用 Admin 的 alterPartitionReassignments 方法执行分区副本重分配时，可能触发此类选举。假设原来的AR是[1，2，3]，Leader 是1，当执行副本重分配后，副本集合AR被设置成[4，5，6]，显然，Leader必须要变更，此时会发生 Reassign Partition Leader 选举。
* PreferredReplicaPartition Leader选举：当你手动运行 kafka-preferred-replica-election 命令，或自动触发了 Preferred Leader 选举时，该类策略被激活。所谓的 Preferred Leader，指的是 AR 中的第一个副本。比如 AR 是[3，2，1]，那么，Preferred Leader就是3。
* ControlledShutdownPartition Leader 选举：当 Broker 正常关闭时，该 Broker上 的所有 Leader 副本都会下线，因此，需要为受影响的分区执行相应的 Leader 选举。
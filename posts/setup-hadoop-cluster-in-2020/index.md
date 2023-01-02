---
title: Setup Hadoop Cluster in 2020
date: '2020-04-17'
spoiler: A step-by-step guide on how to setup a hadoop cluster.
---

## 2020 年了，为什么还是 Hadoop

第一个问题就是，都已经 2020 年了，为什么还是 Hadoop？ 这玩意都出来这么多年了，难道就没有新的产品和技术吗？ Hadoop 虽然已经出来那么多年了，是一个老产品，但是 Hadoop 也不是当年的 Hadoop， 现在更像是一个生态系统，基于 Hadoop 的框架构建的各个产品和技术层出不穷， 但是 HDFS 还是那个 HDFS，学一下背后的细想，更有利于理解和掌握整个体系。


## 搭建 Linux 集群

我选了 Ubuntu 系统，找了 3 台机器，1 个master， 2 个 slave。 首先登陆机器，修改主机名， 在 ubuntu 上修改的是 `/etc/hostname` 的配置，各自修改为 master, slave, slave2。 然后修改 `/etc/hosts`  文件， 配置上 ip 地址和各个别名。 3 台机器都要配置。

```bash
10.0.2.4 master
10.0.2.7 slave
10.0.2.6 slave2
```

配置好别名之后，需要配置 master 和 slaves 之间的 ssh 免密登陆, 用 root 账户创建一个一致的叫做 hadoop 的账户，

```
useradd -m hadoop
passwd hadoop # 设置个密码
```

在 master 机器上，切换到 hadoop 用户，生成 SSH 公钥

```bash
ssh-keygen -t rsa
```

然后将公钥发送到各个 slave 节点上，包括自己

```bash
ssh-copy-id -i ~/.ssh/id_rsa.pub 
ssh-copy-id -i ~/.ssh/id_rsa.pub hadoop@slave
ssh-copy-id -i ~/.ssh/id_rsa.pub hadoop@slave2
```

这时候可以试一下 ssh 免密登陆

```bash
ssh master
ssh slave
ssh slave2
```

应该能直接 ssh 到对应的机器上去了


## 安装 JDK 和 Hadoop

下载 JDK 1.8 和 Hadoop 2.10.0， 我把这两个都放在 /opt 目录下， 并且把 /opt 目录的所有权修改为 hadoop（slave 节点也修改所有者）

```bash
chown -R hadoop /opt
```

修改 `/etc/profile` 文件，在末尾添加

```bash
export JAVA_HOME=/opt/jdk1.8.0_241
export PATH=$PATH:$JAVA_HOME/bin
export HADOOP_HOME=/opt/hadoop-2.10.0
export PATH=$PATH:$HADOOP_HOME/bin
```

配置 Hadoop， 修改的文件都位于 `/opt/hadoop-2.10.0/etc/hadoop/` 目录下， 修改 `hadoop-env.sh` 文件, 在末尾添加

```bash
export JAVA_HOME=/opt/jdk1.8.0_241
export HADOOP_HOME=/opt/hadoop-2.10.0
```

修改 `hdfs-site.xml`, 修改：

```xml
<configuration>
	<property>
		<name>dfs.replication</name>
		<value>3</value>
	</property>
	<property>
		<name>dfs.name.dir</name>
		<value>/opt/hdfs/name</value>
	</property>
	<property>
		<name>dfs.data.dir</name>
		<value>/opt/hdfs/data</value>
	</property>
</configuration>
```

修改 `mapred-site.xml`:

```xml
<configuration>

	<property>
		<name>mapreduce.framework.name</name>
		<value>yarn</value>
	</property>

</configuration>
```

修改 `yarn-site.xml`:

```xml
<configuration>

<!-- Site specific YARN configuration properties -->
<property>
	<name>yarn.resourcemanager.address</name>
	<value>master:8080</value>
</property>

<property>
	<name>yarn.resourcemanager.resource-tracker.address</name>
	<value>master:8082</value>
</property>
<property>
	<name>yarn.nodemanager.aux-services</name>
	<value>mapreduce_shuffle</value>
</property>
<property>
	<name>yarn.nodemanager.aux-services.mapreduce.shuffle.class</name>
	<value>org.apache.hadoop.mapred.ShuffleHandler</value>
</property>



</configuration>
```

再修改 `slaves` 文件, 里面配置 slave 节点的别名

```bash
slave
slave1
```

把修改后的 hadoop 复制到所有的 slave 节点上， 

```bash
scp -r /opt/hadoop-2.10.0/ hadoop@slave:/opt
scp -r /opt/hadoop-2.10.0/ hadoop@slave2:/opt
```

## 格式化 HDFS

```bash
hadoop namenode -format
```

在 hadoop 安装目录下，sbin 目录里有各个文件的启动脚本，

```bash
./start-dfs.sh
./start-yarn.sh
```

启动过程会看到:

```bash

starting yarn daemons
starting resourcemanager, logging to /opt/hadoop-2.10.0/logs/yarn-hadoop-resourcemanager-master.out
slave: starting nodemanager, logging to /opt/hadoop-2.10.0/logs/yarn-hadoop-nodemanager-slave.out
slave2: starting nodemanager, logging to /opt/hadoop-2.10.0/logs/yarn-hadoop-nodemanager-slave2.out
```

应该就启动成功，

一个 Hadoop Cluster 就装好了
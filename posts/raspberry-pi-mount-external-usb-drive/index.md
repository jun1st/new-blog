---
title: '用树莓派挂载移动硬盘搭建 NAS'
date: '2020-01-02'
spoiler: 用树莓派挂载移动硬盘搭建 NAS
---

## 查看所有的已链接的外部设备

```bash
sudo lsblk -o UUID,NAME,FSTYPE,SIZE,MOUNTPOINT,LABEL,MODEL
```

在操作之前，我用 Google 搜到的文档，都说照 sda\* 这样的设备，但是实际上并非如此，我自己的外置移动硬盘的设备标示号是 sdc1 和 sdc2， 因为有分区，所以有两个。 你应该知道你的硬盘
是多大的，所以还是需要自己来识别。

## 安装驱动

为了方便在各个操作系统之间使用，我把硬盘格式化为 exfat 的格式，需要给树莓派装上 exfat 的驱动

```bash
sudo apt-get install exfat-fuse
# sudo apt-get install ntfs-3g #如果硬盘是 ntfs 格式的话，需要装这个驱动

sudo blkid
```

## 挂载硬盘

创建一个新的目录来加载硬盘

```bash

sudo mkdir /mnt/share
sudo mount /dev/sdc2 /mnt/share

ls /mnt/share
```

## 开机自动挂载硬盘

找到已挂载硬盘的 UUID

```bash
sudo blkid
```

找到 /dev/sdc2 的 UUID，类似： 5G24-1483

```bash
sudo vi /etc/fstab
```

在文件尾部，添加一行新的：

```bash
UUID=5G24-1483 /mnt/share exfat defaults,auto,users,rw,nofail 0 0
```

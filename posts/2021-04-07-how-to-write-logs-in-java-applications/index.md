---
title: 'Java 应用程序的日志应该怎么写'
date: '2021-04-07'
spoiler:  '你的应用程序需要有运行日志，Java 应该如何写日志，什么时候需要写，应该怎么写呢？'
---

## 什么时候写日志
为什么需要写日志， 因为程序总会碰到异常情况。 当碰到异常情况，程序停止运行时，如果没有日志，你就无从下手。

日志是帮助开发人员，运维人员在需要的时候，找到需要的信息，修复系统中的 bug

养成良好的记录日志的习惯，是成为一个优秀的开发人员的基本条件。

## 如何写日志

使用参数化的方式来写日志，并且用 "[]" 来对参数进行隔离，

```java

logger.debug("Processing transaction with id: [{}] for user id: [{}] ", id, userId);

```

不要做字符串拼接，这样会产生很多临时的 String 对象，浪费系统资源

```java

logger.debug("Processing transaction with id: " + id + " for user id: " + userId);

```

## 不同级别的使用

当然，有级别就有优先级， Error > Warn > Info > Debug > Trace.  在 Spring Boot 中， 默认的级别是 Info。 这意味着在代码中写的 debug 和 trace 的日志信息会不可见。

### Error

这个级别应该是影响程序正常运行了， 比如：

1. 缺少配置文件，或者配置文件出错
2. 调用第三方服务出错，请求不能继续

程序对于当前的请求不能正常处理，但是不影响别的请求，

### WARN

WARN 的信息，一般是指程序出现不应该出现的，但是尚且不影响正常运行的异常情况。 比如：

1. 机器磁盘到某个临界值了，需要清理
2. 需要的配置文件没找到，但是系统有默认值，

### INFO

系统运行信息，可以记录一些系统关键逻辑的处理信息，

比如记录一下客户端请求参数，调用第三方服务时的调用参数和结果。

当然，并不是所有的 Service 层的代码逻辑，都需要打 log。 打 log 的目的是在需要的时候，能查询到有用的信息，如果记录在一堆很琐碎的信息，只会在你需要查看日志信息的时候带来干扰。

### DEBUG

字面意思，Debug 输出你调试需要的详细的信息，当程序在某些边界情况，出现异常的时候，就会需要用到 Debug 级别，输出详细的信息。 在 Spring Boot 中，默认的日志级别是 Info， Debug 的信息并不会被输出，

因为需要的是 Debug 的信息，所以下面的代码是有问题的：

```java
public Employee getEmployee(Long id) {
    log.debug("开始查询 Employee ID: {}", id)
}
```

为什么？ 因为之所以需要 debug，那么就不会是普通情况， 这里只是输出了收到的参数， 而当 debug 时，应该会需要时输出根据此 ID 查询出来的信息，

```java
public Employee getEmployee(Long id) {
    log.info("开始查询 Employee ID: [{}]", id)

    Employee employee = employeeMapper.find(id)

    log.debug("获取员工 [{}] 的信息"， employee)
}
```

### TRACE

这个级别的日志就更细了，基本用不到。


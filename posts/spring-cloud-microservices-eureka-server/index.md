---
title: '使用 Spring Cloud 构建微服务之一 Eureka Server'
date: '2018-04-11'
spoiler: 使用 Spring Cloud 构建微服务之一 Eureka Server
---

微服务这事，说起来比做起来容易多了。感谢 Pivotal, 有了 Spring Boot， 有了 Spring Cloud， 当然也要感谢
Netflix，为 Spring Cloud 贡献了那么多优秀的项目。

#### 服务的注册和发现 — Eureka

作为一个服务的提供者，需要想一个中枢注册自己这个服务。
作为服务的使用者，需要有一个统一的地方，可以查找都有那些服务可以用。比如以前的中国黄页，甚至现在的 Google，都形式上类似。

[Eureka](https://cloud.spring.io/spring-cloud-netflix/) 就是 Netflix
开源贡献的一个优秀的服务注册和发现项目。

#### 构建 Eureka Server

使用 Eureka Server 构建服务注册和发现应用。我使用 IntelliJ 作为开发工具，在项目新建的 Wizard 中，添加 Eureka
Server 服务：

![](https://cdn-images-1.medium.com/max/800/1*r2TUXrg6g9wOf2qynWV-3g.png)

只需要在 SpringApplication 上添加一个 EnableEurekaServer 的注解，

```java
@SpringBootApplication
@EnableEurekaServer
public class EurekaServerApplication {

   public static void main(String[] args) {
       SpringApplication.run(EurekaServerApplication.class, args);
   }
}
```

并且设置一些服务的属性，就可以启动一个 Eureka Server

```java
server.port=8000
# 是否注册到 eureka 上， 本身是server，所以不注册
eureka.client.register-with-eureka=false
# 是否从 server 获取注册的服务的信息。
eureka.client.fetch-registry=false
# 指定 Eureka Server 地址
eureka.client.serviceUrl.defaultZone=http://localhost:8000/eureka
```

因为所有服务都在本地，所以指定了端口为 8000，方便记忆。 Eureka 默认的端口是 8761。

访问 localhost:8000, 看到的界面应该如下图所示。目前，一个注册的 instances 都还没有。

![](https://cdn-images-1.medium.com/max/1600/1*haL0fhosQOYLBTOUBaylzg.png)

接下去，我们在开发一个 Service Provider 注册到这个 Eureka 上去。

示例代码： [Demo 地址在这里](https://github.com/jun1st/eureka-server)
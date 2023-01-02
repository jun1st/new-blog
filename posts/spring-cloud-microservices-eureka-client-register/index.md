---
title: '使用 Spring Cloud 构建微服务之注册为 Eureka Client'
date: '2018-04-14'
spoiler: 使用 Spring Cloud 构建微服务之注册为 Eureka Client
---

[上一片构建了一个 Eureka
Server，服务注册发现服务](https://medium.com/@jun1st/ä½¿ç¨-spring-cloud-æå»ºå¾®æå¡ä¹ä¸-eureka-3e07eb8dba31)，
现在就来注册一个服务，作为服务的提供者。

**添加 Eureka 依赖**

还是建一个 Spring Boot 应用，需要添加的依赖有

```xml
<dependency>
  <groupId>org.springframework.cloud</groupId>
  <artifactId>spring-cloud-starter-eureka</artifactId>
</dependency>
```

**配置 Eureka 属性**

需要给应用起个名字，作为自己的唯一 ID 在 Eureka Server 上注册自己，并且需要声明 Eureka Server 的地址：

```yaml
spring.application.name=service-provider
eureka.client.serviceUrl.defaultZone=http://localhost:8000/eureka
eureka.instance.prefer-ip-address=true
```

prefer-ip-address 看自己偏好选择。

同时给 Spring Boot 应用添加 EnableEurekaClient 注解，Spring Boot 应用就会想指定的 server 注册自己。

```java
@EnableEurekaClient
@SpringBootApplication
public class ServiceProviderApplication {

   public static void main(String[] args) {
      SpringApplication.run(ServiceProviderApplication.class, args);
   }
}
```

在启动 Eureka Server 的同时，启动 Service Provider 应用，应该就可以在 Server 的页面上看到这个服务已经注册上去了。

![](https://cdn-images-1.medium.com/max/1600/1*zKMpGIa83TwQsdfccTpdTw.png)

[Demo 地址](https://github.com/jun1st/service-provider)
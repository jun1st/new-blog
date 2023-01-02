---
title: '使用 Spring Cloud 构建微服务之Gateway'
date: '2019-04-16'
spoiler: 使用 Spring Cloud 构建微服务之Gateway
---

系统已经微服务化了，并且使用 Eureka 来做了服务的发现与治理。那么接下去的问题就是如何把服务暴露给外部终端使用了。

把所有的 Api Endpoint 都暴露出去吗？如何做请求验证呢？ 如果把所有的 Api Endpoint 都暴露出去，在每个 Api Endpoint
都做一次 AccessToken 验证码？并且终端请求 Api 的粒度和微服务提供的粒度是不一致的。比如：请求一个用户的 Profile 数据，
终端需要的可能是个人信息，账户信息，近期订单信息等。 而在三个信息分别有三个微服务提供，让客户端请求三次吗？

**Api Gateway**

实现一个 Api Gateway 作为一个统一的入口，并且能够把请求转发到背后相应的微服务端。

![](https://cdn-images-1.medium.com/max/1600/1*UT0vkwQSbCH5rQMia4sojg.png)

**用 Zuul 实现 Api Gateway**

用 zuul 能非常快速的实现一个 Api Gateway，同时能和 Eureka 很好的集成。

建立一个 Spring Boot Application，添加 Eureka Client 和 Zuul 相关的依赖

```
<dependency>
    <groupId>org.springframework.cloud</groupId>
    <artifactId>spring-cloud-starter-netflix-eureka-client</artifactId>
</dependency>
<dependency>
    <groupId>org.springframework.cloud</groupId>
    <artifactId>spring-cloud-starter-netflix-zuul</artifactId>
</dependency>
```

在 Application 上开启 EnableDiscoveryClient 和 ZuulProxy

```
@SpringBootApplication
@EnableDiscoveryClient
@EnableZuulProxy
@RestController
public class GatewayApplication {

    @Autowired
    private DiscoveryClient discoveryClient;

    public static void main(String[] args) {
        SpringApplication.run(GatewayApplication.class, args);
    }

    @GetMapping("/")
    public String home() {
        List<ServiceInstance> list = discoveryClient.getInstances("SERVICE-PROVIDER");

        if(list != null && list.size() > 0 )
        {
            return list.get(0).getUri().toString() + ": new 2";
        }

        return "cannot found consultants";
    }
}
```

在代码里，我们用 `discoveryClient` 从 Eureka Server 那里查询是否有注册为 `service-provider` 的微服务。

打开首页：

![](https://cdn-images-1.medium.com/max/1600/1*Wktlsidrk8FadV8DSku9Lw.png)

这里现实的信息和 Eureka Server 上注册的信息一致，

说能从 Eureka Server 发现微服务信息成功。 并且 Zuul 会默认把发现的微服务，通过 zuul 暴露给外部调用：

![](https://cdn-images-1.medium.com/max/1600/1*4ebYDW4h_TfG_JlWHL325g.png)

这里我们通过访问 gateway application 的 `service-provider` , zuul 会把这个请求转发给
service-provider 服务，并且返回结果，

跟直接访问，两者一样。

![](https://cdn-images-1.medium.com/max/1600/1*hbk6Q63f9hOYvCzNcjyTQw.png)

到这里，一个简单的微服务应用就跑起来了， 哈利路亚

Github demo 地址： [gateway](https://github.com/jun1st/gateway)
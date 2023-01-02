---
title: '使用 Spring Cloud 构建微服务之调用 Eureka Client'
date: '2018-04-16'
spoiler: 使用 Spring Cloud 构建微服务之调用 Eureka Client
---

[上一篇](https://medium.com/@fengqijun/ä½¿ç¨-spring-cloud-æå»ºå¾®æå¡ä¹äº-eureka-client-acd6022f94df)
注册了一个简单的 Servcie，这一篇讲一下使用 RestTemplate 来调用注册在 Eureka 上的服务。

**Service Provider**

先给 Service Provider 写一个简单的返回一个 Json 对象的 Api，Greeting

```java
import lombok.Data;
import lombok.experimental.Accessors;

@Data
@Accessors(chain = true)
public class Greeting {
    private String name, message;
}
```

Root Api 直接返回一个 Greeting 对象

```java
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
public class HomeController {

    @GetMapping("")
    public Greeting index() {
        Greeting greeting = new Greeting();
        greeting.setName("Jon")
                .setMessage("How are you");

        return greeting;
    }

}
```

结果：

![](https://cdn-images-1.medium.com/max/1600/1*VFC-nfRVnVVhvBZ_wMzTvA.png)

微服务提供方已经 Ready。

**Service Consumer**

同样也是一个 Spring Boot 应用，同时也是 Eureka 的一个 Client。作为调用方，她是一个使用者。至于是否作为一个服务提供者，可以自由选择。

同样是通过 `application.properties` 配置 eureka 属性

```
server.port=8002

spring.application.name=service-consumer

eureka.client.register-with-eureka=true
eureka.client.enabled=true
eureka.client.serviceUrl.defaultZone=http://localhost:8000/eureka
eureka.instance.prefer-ip-address=true
```

这里设置 `register-with-eureka` 为 `true`，就会把 service-consumer 也注册为一个服务提供方。

可以看到 Service Consumer 也注册进 Eureka 了。
![](https://cdn-images-1.medium.com/max/1600/1*dEKBzhYAcTZY4e-INBBVfg.png)

**Eureka Services 之间如何通讯**

有一个说法说 CS 有两个难题，一个是变量命名，另一个是 `Cache Invalidation`。 还有一个说话是，CS
中的问题，没有一个是不能通过加一层来解决了。这个 Eureka Server 就相当于是中间加的一层。

Consumer 调用 Provider

```java
@RestController
public class HomeController {

    @Autowired
    private RestTemplate restTemplate;

    @GetMapping("/")
    public String echo() {
        return "hello";
    }

    @GetMapping("/call-provider")
    public Object call() {
        Object result = restTemplate.getForObject("http://SERVICE-PROVIDER", Object.class);
        return result;
    }


    @Bean
    @LoadBalanced
    public RestTemplate restTemplate() {
        return new RestTemplateBuilder().build();
    }

}
```

这里个 `Consumer` 添加了一个 `/call-provider` 方法，在方法内，通过 RestTemplate，调用了 provider 的 Api。
这里并没有使用 Url 地址或者 IP 地址，而是使用了注册在 Eureka Server 上的 application name，并且成功的得到了返回结果。

`RestTemplate` 的 `LoadBalanced` 注解来自 Spring Cloud 的 Ribbon 依赖。 Ribbon 是用来干什么的？
下篇再见～

[源代码地址](https://github.com/jun1st/service-consumer)
---
title: 'Quick Introduction to Spring Cloud Config'
date: '2021-08-02'
spoiler: A quick introduction to Spring Cloud Config, server and client. And how to trigger refresh from change
---

Spring Cloud Config 提供了完整的服务器端和客户端的支持。 通过 Config Server， 就有了一个 Centralize 的地方来管理配置文件。 因为都是 Spring 体系的，因此 Spring Application 能很好的融合在一起。 接下来分别介绍 Server 和 Client。

## Config Server

Spring Cloud Config Server 默认使用 Git 作为存储。  首先需要配置 git 地址

```
spring:
  cloud:
    config:
      server:
        git:
          uri: https://github.com/jun1st/configs
          default-label: main
```

添加 @EnableConfigServer， 把一个 Spring Application 作为 Config Server。

```java
@EnableConfigServer
@SpringBootApplication
public class ConfigServerDemoApplication {

	public static void main(String[] args) {
		SpringApplication.run(ConfigServerDemoApplication.class, args);
	}

}
```

同时要提供一个 PropertySource 文件，比如 `fool-development.properties`

```
"string key": "value"
```

然后启动 Config Server 应用，

```
curl localhost:8080/fool/development

{
    name: "fool",
    profiles: [
        "development"
    ],
    label: null,
    version: "29f5d864fa4407dea3f2788c299f0f8c36c774a5",
    state: null,
    propertySources: [
        {
            name: "https://github.com/jun1st/configs/fool-development.properties",
            source: {
                "string: "key": "value""
            }
        }
    ]
}


```

当使用 Git 作为存储时， Config Server 在启动的时候会 Clone 一份 repository 到本地， 并且使用应用的 Environment 来遍历 PropertySource 文件。

```
/{application}/{profile}[/{label}]
/{application}-{profile}.yml
/{label}/{application}-{profile}.yml
/{application}-{profile}.properties
/{label}/{application}-{profile}.properties
```

所以，现在如果访问 `http://localhost:8080/fool-development.properties`, 直接返回 properties 文件，

```
"string: key": "value"
```

这里的 profile 就是 spring.profiles.active 这里的 profile， label 是 git 的分支名字，默认是 master


demo 地址： [https://github.com/jun1st/config-server-demo](https://github.com/jun1st/config-server-demo)

## Config Client

配置文件是个应用程序来用的， 不是当作 Api 来使用了，所以再来建一个 Client 应用来访问 Server Config。

配置好 `application.yml`

```
server:
  port: 9090

spring:
  config:
    import: "optional:configserver:"
  cloud:
    config:
      uri: http://localhost:8080
  application:
    name: smart
```

应用启动的时候，会到看 console 输出这么一行：

```
Fetching config from server at : http://localhost:8080
Located environment: name=smart, profiles=[default], label=null, version=2ed1021521dc646922ad8254edbc9bc6d351c4d9, state=null
```


在 config-server 指定的 git repo 中增加了 `smart-local.properties` 之后，再启动，在 Config Server 应用的 console log 会看到：

```
Adding property source: Config resource 'file [/var/folders/gs/ph_gp04x2dnb1thdk4y4qc1w0000gn/T/config-repo-14660418775293975304/smart-local.properties]' via location 'file:/var/folders/gs/ph_gp04x2dnb1thdk4y4qc1w0000gn/T/config-repo-14660418775293975304/'
```

### 使用 Config Value

之所以 Spring 框架可以做到几乎一统 Java 应用开发，就是好用！ 引入 spring cloud config， 他的使用跟你使用本地的 config value 没有区别，

```
@Value("${name}")
private String name;

@GetMapping("/name")
public String getName() {
  return name;
}

curl 'http://localhost:9090/name'
## "smart application"
```

### 刷新 Config 值

在 Config Client 这一端启动之后，从 Server 获取的值是保存在内存中的。 那怎么样来获取最新的变更吗？ 重新启动吗？ 

Spring Boot 有 RefreshScope 的概念， Spring Boot Acutator 提供了 Refresh 的功能， 调用 ` post /refresh`  接口就能获取到最新的变更

此外，还有 `spring boot cloud bus` 这个组件可以用。 cloud bus 通过消息队列来 pub/sub 变更通知。 他支持 Kafka 和 RabbitMQ。 

使用 cloud bus 相对复杂一些， 值得专门写一遍文章来介绍。




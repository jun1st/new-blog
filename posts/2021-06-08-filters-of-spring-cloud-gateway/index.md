---
title: Web Filter, Global Filter and Gateway Filter of Spring Cloud Gateway
date: '2021-06-08'
spoiler: Spring Cloud Gateway 是 Spring Cloud 项目推出的用来代替 Zuul 的项目。 由于 Spring Framework 5.0 支持了 Reactive 的模式，而 Zuul 不支持 Reactive，并且 Netfilx 也没有继续支持 Zuul 的计划，因此 Spring Cloud 组推出了 Spring Cloud Gateway。 本文介绍一下 Spring Cloud Gateway 中可以使用的三种 Filter， Web Filter， Global Filter 和 Gateway Filter。


slug: web-filter-global-filter-and-gateway-filter-of-spring-cloud-gateway
---

## Filters

Filter,  顾名思义就是过滤器。 在一个 Web 请求进来或者出去之前可以使用 Filter 来对 Request 或者 Response 进行拦截修改。

### Web Filter:

> Contract for interception-style, chained processing of Web requests that may be used to implement cross-cutting, application-agnostic requirements such as security, timeouts, and others.
Since:
5.0

Web Filter 来自 Spring 的 web framework，并不是 Spring Cloud Gateway 独有的。

###  Global Filter 和 Gateway Filter

关于 GlobalFilter 和 Gateway Filter， Spring 的官方文档上是这么说的， 

Global Filter： 

> The GlobalFilter interface has the same signature as GatewayFilter. These are special filters that are conditionally applied to all routes

Gateway Filter： 

>Route filters allow the modification of the incoming HTTP request or outgoing HTTP response in some manner. Route filters are scoped to a particular route. Spring Cloud Gateway includes many built-in GatewayFilter Factories.


可以看出， GlobalFilter 和 Gateway Filter 是同一种Filter， 因此他们可以有同样的 Filter 方法的签名。 同时 GlobalFilter 是一种特殊的 Gateway Filter。 Gateway Filter 只针对某一个 route 起作用，而 Global Filter 针对所有的 route 起作用。



## 使用 WebFilter

在你想要对所有的 Web 请求做出拦截动作的时候，使用 WebFilter。 比如需要做请求做 Authentication

```java
@Slf4j
@Component
public class AccessTokenFilter implements WebFilter {
    @Override
    public Mono<Void> filter(ServerWebExchange exchange, WebFilterChain chain) {
        ServerHttpRequest request = exchange.getRequest();

        String accessToken = request.getQueryParams().getFirst("access_token");
        log.info("access token {}", accessToken);

        return chain.filter(exchange);
    }
}

```

## 使用 Global Filter

想对所有被 gateway 做过 route 动作的请求做处理的时候。 比如统计 backend service 的响应时间。

```java
@Slf4j
@Component
public class ProcessTimeFilter implements GlobalFilter, Ordered {

    private static final String COUNT_START_TIME = "countStartTime";

    @Override
    public Mono<Void> filter(ServerWebExchange exchange, GatewayFilterChain chain) {
        exchange.getAttributes().put(COUNT_START_TIME, Instant.now().toEpochMilli());

        return chain.filter(exchange).then(
          Mono.fromRunnable(() -> {
              long startTime = exchange.getAttribute(COUNT_START_TIME);
              long endTime = (Instant.now().toEpochMilli()) - startTime;

              log.info("{} : {} ms", exchange.getRequest().getURI().getRawPath(), endTime);
          })
        );
    }

    @Override
    public int getOrder() {
        return 0;
    }
}
```

## 使用 Gateway Filter

有两种方式来自定义一个 Gateway Filter，可以通过实现 GatewayFilter 接口, 也可以通过继承抽象 GatewayFilter Factory 来实现。


实现 Gateway Filter 接口

```java
@Slf4j
@Component
public class RedirectFilter implements GatewayFilter {
    @SneakyThrows
    @Override
    public Mono<Void> filter(ServerWebExchange exchange, GatewayFilterChain chain) {
        ServerHttpRequest request = exchange.getRequest();

        String path = request.getPath().value();

        if (path != null && path.contains("filterme")) {
            URI uri = new URI("https://httpbin.org");
            ServerHttpRequest newRequest = exchange.getRequest().mutate().uri(uri).build();

            if (!exchange.getResponse().isCommitted()) {
                ServerWebExchangeUtils.setResponseStatus(exchange, HttpStatus.valueOf(302));
                ServerHttpResponse response = exchange.getResponse();
                response.getHeaders().set("Location", uri.toString());
                return response.setComplete();
            } else {
                return chain.filter(exchange);
            }
        }
        return chain.filter(exchange);
    }
}
```

这个 Filter 的作用是，一旦监测到 path 中包含有 filterme， 就直接做重定向，不再继续走 filter chain 了。

在 RouteLocatorBuilder 中，使用这个 Filter

```java
builder.routes()
		.route("customFilter", r -> r.path("/filterme")
		.filters( f -> f.filters(new RedirectFilter()))
		.uri("https://www.baidu.com"))
```


继承 GatewayFilterFactory 来创建，

```java
@Component
public class MyRedirectGatewayFilterFactory
        extends AbstractGatewayFilterFactory<MyRedirectGatewayFilterFactory.Config> {

    public MyRedirectGatewayFilterFactory() {
        super(Config.class);
    }

    @Override
    public GatewayFilter apply(Config config) {
        return (exchange, chain) -> {
            ServerHttpRequest request = exchange.getRequest();

            String path = request.getPath().value();

            if (path != null && path.matches(config.pathPattern)) {
                URI uri = null;
                try {
                    uri = new URI("https://httpbin.org");
                } catch (URISyntaxException e) {
                    e.printStackTrace();
                }
                ServerHttpRequest newRequest = exchange.getRequest().mutate().uri(uri).build();

                if (!exchange.getResponse().isCommitted()) {
                    ServerWebExchangeUtils.setResponseStatus(exchange, HttpStatus.valueOf(302));
                    ServerHttpResponse response = exchange.getResponse();
                    response.getHeaders().set("Location", uri.toString());
                    return response.setComplete();
                }
            }

            return chain.filter(exchange);
        };
    }

    public static class Config {
        private String pathPattern;

        private boolean preLogger;
        private boolean postLogger;

        public Config() {

        }

        public Config(String pathPattern, boolean preLogger, boolean postLogger) {
            super();
            this.pathPattern = pathPattern;
            this.preLogger = preLogger;
            this.postLogger = postLogger;
        }

        public String getPathPattern() {
            return pathPattern;
        }

        public void setPathPattern(String pathPattern) {
            this.pathPattern = pathPattern;
        }

        public boolean isPreLogger() {
            return preLogger;
        }

        public void setPreLogger(boolean preLogger) {
            this.preLogger = preLogger;
        }

        public boolean isPostLogger() {
            return postLogger;
        }

        public void setPostLogger(boolean postLogger) {
            this.postLogger = postLogger;
        }
    }

}
```

```yaml
-   id: myredirect
    uri: https://www.baidu.com
    predicates:
        - Path=/filterme
    filters:
        - name: MyRedirect
            args:
                - pathPattern: filterme
```

第一种方式，方便通过代码来添加 filter， 第二种方式，方便通过配置的方式来添加 filter，并且参数也是可以配置的。


三种方式，基本上能覆盖所有的情况了。总结一下：

1. WebFilter： 所有的请求都会被 filter
2. Gateway Filter： 对某一个被路由请求进行 filter
3. Global Filter： 对所有被路由请求进行 filter
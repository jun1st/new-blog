---
title: General Introduction To OAuth Authentication
date: '2021-01-25'
spoiler: 在 Mac 本地机器上搭建一个 Zookeeper 集群
---


## Authorization Grant Types

### Authorization Code

授权码，Authorization Code， 是由授权服务器代表资源所有者颁发给 Client 的，访问该资源的一种授权。这个授权服务器作为 Client 和资源所有者之间的一个媒介，在授权过程中，授权服务器负责和 Resource Owner 之间做验证，Resource Owner 只和授权服务器做验证，资源所有者的 credential 信息不会透露给 Client。

通俗一点来说，Client 把需要验证的用户重定向到授权服务器上，用户在授权服务器上输入自己的 credential 信息，授权服务器拿到credential 信息之后，去做验证，验证通过之后，返回一个 Authorization Code 给到 Client。

### Implict

简化的 Authorization Code 授权模式， 通常被用于浏览器中授权， 过程中不再通过授权服务器，而是由 Resource Owner 直接返回 Access Code 给 Client。 这个过程由于跳过了中间的授权服务器，提高了授权的响应速度，但是由于这个授权码 Access Token 是通过 RedirectUrl 来传递了，这个大大提高了暴露的风险。

### Resource Owner Password Credentials
在授权过程中，直接使用用户名密码登陆，比如登陆 Twitter， Facebook 等自家 App。 

如果你是用 TweetBot 这种第三方的 App，登陆过程走的就是第一个种 Authorization Code 的方式。

### Client Credentials

Client Credential 这种模式通常是指当前的 Client 是需要访问的资源的 Owner，或者已经获得了授权，有权限访问制定的资源。



## Access Token

## Refresh Token
用来获取 Access Token，

A refresh token is a string representing the authorization granted to the client by the resource owner. The string is usually opaque to the client.

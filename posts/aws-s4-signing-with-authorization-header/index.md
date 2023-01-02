---
title: 'AWS S4 Signing With Authorization Header'
date: '2018-07-07'
spoiler: AWS S4 Signing With Authorization Header
---

## 计算 S4 签名

想要直接在客户端上传文件到 AWS S3，需要通过计算基于 S4 的签名

AWS 的签名计算已经更新到第四版了，标准的步骤还是跟之前的版本差不多，分为 4 步：

1.  发起一个请求
1.  根据请求和相关的信息，计算出一个需要进行签名的字符串
1.  根据 aws 提供的 access key 推导出一个签名用的 key，然后用这个签名的 key 给第二步中计算的字符串进行签名，计算出一个签名
1.  把签名返回给客户端，客户端带着这个签名进行操作

[AWS
官方的参考文档在这里](https://docs.aws.amazon.com/general/latest/gr/signature-version-4.html)

---

#### 创建请求

客户端需要提交给计算签名 Api 的数据有 3 个

1.  需要上传的内容的 hash 值
1.  需要上传内容的长度
1.  上传内容的类型
1.  其它自定义数据

签名 API 根据客户端提供的数据，计算出一个唯一的 endpoint url， 稍后需要返回给客户端用，同时这个 endpoint url 还需要用在签名里。

#### 计算签名

1.  计算 Canonicalized Header Names

![](https://cdn-images-1.medium.com/max/1600/1*XGhOOWr2NJidO3EinTdb1g.png)

2. 计算 Canonicalized Headers

![](https://cdn-images-1.medium.com/max/2000/1*uP31LFBqE1hV3AxMyKCHKw.png)

3. 计算 Canonical Request

![](https://cdn-images-1.medium.com/max/1600/1*tM8i5zHplSHNoIPePbLzOg.png)

4. 计算待签名字符串

![](https://cdn-images-1.medium.com/max/2000/1*lf5SDGh1Cfa3X_0Q04gYiw.png)

5. 计算 Signing Key

![](https://cdn-images-1.medium.com/max/1600/1*Ms18UI2werMOaRQtNSo4dQ.png)

这里 SCHEME 就是 AWS4, TERMINATOR 是 aws4_request, serviceName 是 s3, regionName 就是 你的
bucket 或者别的 service 所在的 region

6. 计算 Signature

   byte[] signature =
   (stringToSign, kSigning, "HmacSHA256");

最后，拼成完成的 authorization header 返回：

![](https://cdn-images-1.medium.com/max/1600/1*wclU8vz3mMJrCRbBQRk4Ng.png)

authorizationHeader 就是最后的结果～

---

#### 客户端调用

最后在客户端调用的时候，需要使用在计算签名时返回的 url 作为 endpoint， 并且，签名时所使用到的 header 一个都不能少

所有用到的代码都在这里：
[gists](https://gist.github.com/jun1st/b5b1f0b0bac37e30f279659a6f091fca)
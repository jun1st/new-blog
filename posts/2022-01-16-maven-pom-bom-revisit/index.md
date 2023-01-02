---
title:  Maven 基础知识之 POM 和 BOM
date: '2022-01-17'
spoiler: 温故而知新系列之 Maven 的 Pom 和 Bom
---

## Super POM: Project Inheritance

Java 真的是面向对象的，连这个 pom 文件，都有一个 SUPER Pom， 所有的 POM 都默认继承自这个 POM 对象，

https://maven.apache.org/ref/3.6.3/maven-model-builder/super-pom.html

这个 super pom 文件决定了 maven 的一些基本属性，比如 build 的目录是 `target`， 源代码的目录是 `src/main/java` 等。 继承下来的属性有下面这一些：

* dependencies
* developers and contributors
* plugin lists (including reports)
* plugin executions with matching ids
* plugin configuration
* resources

既然默认有继承，那么就可以修改继承关系， POM 里面就是通过 `parent`

```xml
<parent>
    <groupId>com.mycompany.app</groupId>
    <artifactId>my-app</artifactId>
    <version>1</version>
    <relativePath>../parent/pom.xml</relativePath>
</parent>
```

## Project Aggregation

Maven 作为一个打包构建工具，提供了包组合的功能。 在 pom 文件中，要修改两个地方：

> 在最外层的包，比如 parent 包， 设置 `packaging` 属性为 pom，
> 添加 `modules` 子元素

比如：

```xml
<project>
  <modelVersion>4.0.0</modelVersion>
 
  <groupId>com.mycompany.app</groupId>
  <artifactId>my-app</artifactId>
  <version>1</version>
  <packaging>pom</packaging>
 
  <modules>
    <module>../my-module</module>
  </modules>
</project>
```

这种方式构建出来的 maven 包，就会包含 `modules` 中包含的内容。 

```shell
mvn install my-app
```

会同时安装 `my-module`

## 变量

```xml
<properties>
    <mavenVersion>3.0</mavenVersion>
</properties>


<dependencies>
    <dependency>
        <groupId>org.apache.maven</groupId>
        <artifactId>maven-artifact</artifactId>
        <version>${mavenVersion}</version>
    </dependency>
</dependencies>

```

## BOM: Bill of Materials

Maven 通过 transitive dependency 机制，来解决版本依赖和必须声明版本的问题。 关于 Transitive Dependencies 的说明，详细的可以看![这里](https://maven.apache.org/guides/introduction/introduction-to-dependency-mechanism.html#transitive-dependencies), 简单来说就是一句话， 

### Dependency Scope

Dependency Scope 的作用是限定 transivity 的范围， 总共有 6 种 Scope。

* compile: 这是默认的 scope，dependencies 需要编译的时候，存在在 classpath 里
* provided: 这个表示 jdk 提供，或者运行时的容器环境会存在。
* runtime: 编译时不需要，执行时需要
* test: 测试时需要
* system: 这个 provided 类似，只是说需要在运行时直接提供 jar 包， 比如执行命令时声明 -jar
* import:  这个只能用在 `<dependencyManagement>` 里，并且依赖类型是前面提到的 `pom` 类型。 

**Import** 这种方式在定义某个 Library 的时候，这个 Library 本身又拆分为几个小的子 libary 的时候最有效。 

把这个项目作为一个 root 的 BOM POM， 这个 bom 项目定义了所有它包含的 artifacts 的版本。

```xml
<project xmlns="http://maven.apache.org/POM/4.0.0" xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
    xsi:schemaLocation="http://maven.apache.org/POM/4.0.0 http://maven.apache.org/xsd/maven-4.0.0.xsd">
  <modelVersion>4.0.0</modelVersion>
  <groupId>com.test</groupId>
  <artifactId>bom</artifactId>
  <version>1.0.0</version>
  <packaging>pom</packaging>
  <properties>
    <project1Version>1.0.0</project1Version>
    <project2Version>1.0.0</project2Version>
  </properties>
 
  <dependencyManagement>
    <dependencies>
      <dependency>
        <groupId>com.test</groupId>
        <artifactId>project1</artifactId>
        <version>${project1Version}</version>
      </dependency>
      <dependency>
        <groupId>com.test</groupId>
        <artifactId>project2</artifactId>
        <version>${project2Version}</version>
      </dependency>
    </dependencies>
  </dependencyManagement>
 
  <modules>
    <module>parent</module>
  </modules>
</project>
```

这个 bom 项目，包含一个叫做 `parent` 的 artifact。  这个 artifact 以上面那个 bom 作为 parent，

```xml
<project xmlns="http://maven.apache.org/POM/4.0.0" xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
     xsi:schemaLocation="http://maven.apache.org/POM/4.0.0 http://maven.apache.org/xsd/maven-4.0.0.xsd">
  <modelVersion>4.0.0</modelVersion>
  <parent>
    <groupId>com.test</groupId>
    <version>1.0.0</version>
    <artifactId>bom</artifactId>
  </parent>
 
  <groupId>com.test</groupId>
  <artifactId>parent</artifactId>
  <version>1.0.0</version>
  <packaging>pom</packaging>
 
  <dependencyManagement>
    <dependencies>
      <dependency>
        <groupId>log4j</groupId>
        <artifactId>log4j</artifactId>
        <version>1.2.12</version>
      </dependency>
      <dependency>
        <groupId>commons-logging</groupId>
        <artifactId>commons-logging</artifactId>
        <version>1.1.1</version>
      </dependency>
    </dependencies>
  </dependencyManagement>
  <modules>
    <module>project1</module>
    <module>project2</module>
  </modules>
</project>
```

```xml
<project xmlns="http://maven.apache.org/POM/4.0.0" xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
     xsi:schemaLocation="http://maven.apache.org/POM/4.0.0 http://maven.apache.org/xsd/maven-4.0.0.xsd">
  <modelVersion>4.0.0</modelVersion>
  <parent>
    <groupId>com.test</groupId>
    <version>1.0.0</version>
    <artifactId>parent</artifactId>
  </parent>
  <groupId>com.test</groupId>
  <artifactId>project1</artifactId>
  <version>${project1Version}</version>
  <packaging>jar</packaging>
 
  <dependencies>
    <dependency>
      <groupId>log4j</groupId>
      <artifactId>log4j</artifactId>
    </dependency>
  </dependencies>
</project>
 
<project xmlns="http://maven.apache.org/POM/4.0.0" xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
     xsi:schemaLocation="http://maven.apache.org/POM/4.0.0 http://maven.apache.org/xsd/maven-4.0.0.xsd">
  <modelVersion>4.0.0</modelVersion>
  <parent>
    <groupId>com.test</groupId>
    <version>1.0.0</version>
    <artifactId>parent</artifactId>
  </parent>
  <groupId>com.test</groupId>
  <artifactId>project2</artifactId>
  <version>${project2Version}</version>
  <packaging>jar</packaging>
 
  <dependencies>
    <dependency>
      <groupId>commons-logging</groupId>
      <artifactId>commons-logging</artifactId>
    </dependency>
  </dependencies>
</project>
```

上面的过程是：

1. 你指定一个 bom project，这个 bom 包含一个 parent artifact， 
2. parent artifact 继承自 bom， 并且包含了公共的，需要的 dependency，
3. project 1 继承自 parent， 通过 parent，可以访问 {project1version}
4. project 2 继承自 parent， 通过 parent，可以访问 {project2version}

因此可以做到通过 bom 控制包含的子 module 的版本。

实际使用

```xml
<project xmlns="http://maven.apache.org/POM/4.0.0" xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
     xsi:schemaLocation="http://maven.apache.org/POM/4.0.0 http://maven.apache.org/xsd/maven-4.0.0.xsd">
  <modelVersion>4.0.0</modelVersion>
  <groupId>com.test</groupId>
  <artifactId>use</artifactId>
  <version>1.0.0</version>
  <packaging>jar</packaging>
 
  <dependencyManagement>
    <dependencies>
      <dependency>
        <groupId>com.test</groupId>
        <artifactId>bom</artifactId>
        <version>1.0.0</version>
        <type>pom</type>
        <scope>import</scope>
      </dependency>
    </dependencies>
  </dependencyManagement>
  <dependencies>
    <dependency>
      <groupId>com.test</groupId>
      <artifactId>project1</artifactId>
    </dependency>
    <dependency>
      <groupId>com.test</groupId>
      <artifactId>project2</artifactId>
    </dependency>
  </dependencies>
</project>
```

这里的 dependencies，就直接引入了 project 1 和 project 2， 版本通过 bom 指定了 1.0.0


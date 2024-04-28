---
title: Java 中的 CompletableFuture
date: '2024-04-18'
spoiler: 什么是 CompletableFuture， 为什么会有 CompletableFuture， 以及他最经典的用法
---


这篇文章是关于Java中CompletableFuture类的指南，它介绍了CompletableFuture的功能和使用案例。以下是文章的翻译摘要：

## 引言
这篇文章是关于Java 8并发API改进中引入的CompletableFuture类的指南。

## Java中的异步计算
异步计算难以理解。我们通常希望将任何计算视为一系列步骤，但在异步计算的情况下，作为回调表示的动作往往会分散在代码中，或者彼此深度嵌套。当我们需要处理在某个步骤中可能发生的错误时，情况会变得更糟。

Java 5中添加了Future接口，作为异步计算的结果，但它没有任何方法来组合这些计算或处理可能发生的错误。

Java 8引入了CompletableFuture类。 除了Future接口，它还实现了CompletionStage接口。这个接口定义了我们可以与其他步骤组合的异步计算步骤的合同。

CompletableFuture既是一个构建块，也是一个框架，拥有大约50种不同的方法来组合、组合和执行异步计算步骤以及处理错误。

如此庞大的API可能会让人不知所措，但这些方法大多可以归为几个清晰且明显不同的用例。

## 使用CompletableFuture作为简单的Future
首先，CompletableFuture类实现了Future接口，因此我们可以使用它作为Future实现，但具有额外的完成逻辑。

例如，我们可以使用无参构造函数创建此类的实例来表示一些未来的结果，将其分发给消费者，并在将来的某个时间点使用complete方法完成它。消费者可以使用get方法阻塞当前线程，直到提供此结果。

在下面的示例中，我们有一个方法，它创建了一个CompletableFuture实例，然后在另一个线程中启动了一些计算，并立即返回了Future。

当计算完成时，该方法通过向complete方法提供结果来完成Future：

```java
public Future<String> calculateAsync() throws InterruptedException {
    CompletableFuture<String> completableFuture = new CompletableFuture<>();
    
    Executors.newCachedThreadPool().submit(() -> {
        Thread.sleep(500);
        completableFuture.complete("Hello");
        return null;
    });
    
    return completableFuture;
}
```

要启动计算，我们使用Executor API。创建和完成CompletableFuture的这种方法可以与任何并发机制或API一起使用，包括原始线程。

请注意，calculateAsync方法返回一个Future实例。

我们只需调用该方法，接收Future实例，并在我们准备好阻塞结果时调用它的get方法。

还要注意，get方法会抛出一些受检异常，即ExecutionException（封装了在计算期间发生的异常）和InterruptedException（表示线程在活动之前或期间被中断的异常）：

```java
Future<String> completableFuture = calculateAsync();

// ...

String result = completableFuture.get();
assertEquals("Hello", result);
```

如果我们已经知道计算的结果，我们可以使用静态的completedFuture方法，参数是表示此计算结果的参数。因此，Future的get方法将永远不会阻塞，而是立即返回这个结果：

```java
Future<String> completableFuture =
  CompletableFuture.completedFuture("Hello");

// ...

String result = completableFuture.get();
assertEquals("Hello", result);
```

作为另一种情况，我们可能想要取消Future的执行。

## 带有封装计算逻辑的CompletableFuture
上面的代码允许我们选择任何并发执行机制，但如果我们想跳过这个样板代码并异步执行一些代码怎么办？

静态方法runAsync和supplyAsync允许我们分别从Runnable和Supplier函数类型创建一个CompletableFuture实例。

Runnable和Supplier是函数式接口，由于Java 8的新特性，允许我们通过lambda表达式传递它们的实例。

Runnable接口是用于线程的旧接口，不允许返回值。

Supplier接口是一个通用的函数式接口，有一个没有参数并返回参数化类型值的单个方法。

这允许我们提供一个Supplier实例作为lambda表达式来进行计算并返回结果。它就像这样简单：

```java
CompletableFuture<String> future
  = CompletableFuture.supplyAsync(() -> "Hello");

// ...

assertEquals("Hello", future.get());
```

## 处理异步计算的结果
处理计算结果的最通用方法是将其传递给一个函数。thenApply方法正是这样做的；它接受一个Function实例，使用它来处理结果，并返回一个持有函数返回值的Future：

```java
CompletableFuture<String> completableFuture
  = CompletableFuture.supplyAsync(() -> "Hello");

CompletableFuture<String> future = completableFuture
  .thenApply(s -> s + " World");

assertEquals("Hello World", future.get());
```

如果我们不需要在Future链中返回值，我们可以使用Consumer函数式接口的实例。它的单一方法接受一个参数并返回void。

CompletableFuture中有一个针对这种情况的方法。thenAccept方法接收一个Consumer并将其计算结果传递给它。然后最终的future.get()调用返回一个Void类型的实例：

```java
CompletableFuture<String> completableFuture
  = CompletableFuture.supplyAsync(() -> "Hello");

CompletableFuture<Void> future = completableFuture
  .thenAccept(s -> System.out.println("Computation returned: " + s));

future.get();
```

最后，如果我们既不需要计算的值，也不想在链的末尾返回一些值，那么我们可以向thenRun方法传递一个Runnable lambda。在以下示例中，我们在调用future.get()之后简单地在控制台打印一行：

```java
CompletableFuture<String> completableFuture
  = CompletableFuture.supplyAsync(() -> "Hello");

CompletableFuture<Void> future = completableFuture
  .thenRun(() -> System.out.println("Computation finished."));

future.get();
```

## 组合Futures
CompletableFuture API的最精彩部分是能够将CompletableFuture实例组合成一系列计算步骤。

这种链式操作的结果是本身是一个CompletableFuture，允许进一步的链式和组合。这种方法在函数式语言中无处不在，通常被称为单子设计模式。

在以下示例中，我们使用thenCompose方法顺序地链接两个Futures。

注意，此方法接受一个返回CompletableFuture实例的函数。这个函数的参数是先前计算步骤的结果。这允许我们在下一个CompletableFuture的lambda内部使用这个值：

```java
CompletableFuture<String> completableFuture
  = CompletableFuture.supplyAsync(() -> "Hello")
    .thenCompose(s -> CompletableFuture.supplyAsync(() -> s + " World"));

assertEquals("Hello World", completableFuture.get());
```

thenCompose方法和thenApply实现了单子模式的基本构建块。它们与Java 8中也可用的Stream和Optional类的map和flatMap方法密切相关。

这两种方法都接受一个函数并将其应用于计算结果，但thenCompose（flatMap）方法接受一个返回相同类型另一个对象的函数。这种函数结构允许将这些类的实例作为构建块组合。

如果我们想执行两个独立的Futures并对它们的结果进行操作，我们可以使用thenCombine方法，该方法接受一个Future和一个有两个参数的Function来处理两个结果：

```java
CompletableFuture<String> completableFuture
  = CompletableFuture.supplyAsync(() -> "Hello")
    .thenCombine(CompletableFuture.supplyAsync(() -> " World"), (s1, s2) -> s1 + s2);

assertEquals("Hello World", completableFuture.get());
```

一个更简单的情况是我们想对两个Futures的结果进行操作，但不需要将任何结果值传递到Future链中。thenAcceptBoth方法在这里可以提供帮助：

```java
CompletableFuture future = CompletableFuture.supplyAsync(() -> "Hello")
  .thenAcceptBoth(CompletableFuture.supplyAsync(() -> " World"),
    (s1, s2) -> System.out.println(s1 + s2));
```

## thenApply()和thenCompose()之间的区别
在我们之前的部分中，我们已经展示了关于thenApply()和thenCompose()的示例。这两个API帮助我们链接不同的CompletableFuture调用，但这两个函数的用途是不同的。

### thenApply()
我们可以使用这个方法来处理前一个调用的结果。 但要记住的关键一点是，返回类型将是所有调用的组合。

因此，当我们想要转换一个CompletableFuture调用的结果时，这个方法很有用：

```java
CompletableFuture<Integer> finalResult = compute().thenApply(s-> s + 1);
```

### thenCompose()

thenCompose()类似于thenApply()，两者都返回一个新的CompletionStage。然而，thenCompose()使用前一个阶段作为参数。它将展平并直接返回一个带有结果的Future，而不是我们在thenApply()中观察到的嵌套Future：

```java
CompletableFuture<Integer> computeAnother(Integer i){
    return CompletableFuture.supplyAsync(() -> 10 + i);
}
CompletableFuture<Integer> finalResult = compute().thenCompose(this::computeAnother);
```

因此，如果想法是链接CompletableFuture方法，那么使用thenCompose()更好。

同样，请注意这两种方法之间的区别类似于map()和flatMap()之间的区别。

## 并行运行多个Futures
当我们需要并行执行多个Futures时，我们通常希望等待它们全部执行完成，然后处理它们组合的结果。

CompletableFuture.allOf静态方法允许我们等待作为变长参数提供的所有的Futures完成：

```java
CompletableFuture<String> future1
  = CompletableFuture.supplyAsync(() -> "Hello");
CompletableFuture<String> future2
  = CompletableFuture.supplyAsync(() -> "Beautiful");
CompletableFuture<String> future3
  = CompletableFuture.supplyAsync(() -> "World");

CompletableFuture<Void> combinedFuture
  = CompletableFuture.allOf(future1, future2, future3);

// ...

combinedFuture.get();

assertTrue(future1.isDone());
assertTrue(future2.isDone());
assertTrue(future3.isDone());
```

注意，CompletableFuture.allOf()的返回类型是CompletableFuture<Void>。这个方法的局限性在于它不返回所有Futures的组合结果。相反，我们必须手动从Futures获取结果。幸运的是，CompletableFuture.join()方法和Java 8 Streams API使这变得简单：

```java
String combined = Stream.of(future1, future2, future3)
  .map(CompletableFuture::join)
  .collect(Collectors.joining(" "));

assertEquals("Hello Beautiful World", combined);
```

CompletableFuture.join()方法类似于get方法，但如果Future未正常完成，它会抛出一个未检查的异常。这使得它可以作为Stream.map()方法中的方法引用使用。

## 处理错误
在异步计算步骤链中进行错误处理，我们必须以类似的方式适应throw/catch惯用法。

而不是在语法块中捕获异常，CompletableFuture类允许我们在特殊的handle方法中处理它。这个方法接受两个参数：计算的结果（如果成功完成）和抛出的异常（如果某个计算步骤未正常完成）。

在以下示例中，我们使用handle方法在异步计算的问候由于没有提供名称而以错误结束时提供默认值：

```
String name = null;

// ...

CompletableFuture<String> completableFuture
  = CompletableFuture.supplyAsync(() -> {
      if (name == null) {
          throw new RuntimeException("Computation error!");
      }
      return "Hello, " + name;
  }).handle((s, t) -> s != null ? s : "Hello, Stranger!");

assertEquals("Hello, Stranger!", completableFuture.get());
```

作为另一种情况，假设我们想要手动使用值完成Future，就像在第一个示例中一样，但也希望能够用异常完成它。completeExceptionally方法正是为此而设计的。以下示例中的completableFuture.get()方法会抛出一个ExecutionException，其原因为RuntimeException：

```java
CompletableFuture<String> completableFuture = new CompletableFuture<>();

// ...

completableFuture.completeExceptionally(
  new RuntimeException("Calculation failed!"));

// ...

completableFuture.get(); // ExecutionException
```

在上面的示例中，我们可以使用handle方法异步处理异常，但使用get方法，我们可以使用更典型的同步异常处理方法。

## 异步方法
CompletableFuture类中的大多数流畅API方法都有两个带有Async后缀的额外变体。这些方法通常旨在在另一个线程中运行相应的执行步骤。

没有Async后缀的方法使用调用线程运行下一个执行阶段。相比之下，没有Executor参数的Async方法在并行度大于1的情况下，使用ForkJoinPool.commonPool()访问的Executor的公共fork/join池实现来运行一个步骤。最后，带有Executor参数的Async方法使用传递的Executor运行一个步骤。

以下是使用Function实例处理计算结果的修改示例。唯一的可见区别是thenApplyAsync方法，但在底层，函数的应用被包装成一个ForkJoinTask实例（有关fork/join框架的更多信息，请参阅文章“Java中Fork/Join框架的指南”）。这允许我们进一步并行化我们的计算，更有效地利用系统资源：

```java
CompletableFuture<String> completableFuture
  = CompletableFuture.supplyAsync(() -> "Hello");

CompletableFuture<String> future = completableFuture
  .thenApplyAsync(s -> s + " World");

assertEquals("Hello World", future.get());
```

## JDK 9 CompletableFuture API
Java 9通过以下更改增强了CompletableFuture API：

添加了新的工厂方法
支持延迟和超时
改进了对子类的更好支持
以及新的实例API：

```java
Executor defaultExecutor()
CompletableFuture<U> newIncompleteFuture()
CompletableFuture<T> copy()
CompletionStage<T> minimalCompletionStage()
CompletableFuture<T> completeAsync(Supplier<? extends T> supplier, Executor executor)
CompletableFuture<T> completeAsync(Supplier<? extends T> supplier)
CompletableFuture<T> orTimeout(long timeout, TimeUnit unit)
CompletableFuture<T> completeOnTimeout(T value, long timeout, TimeUnit unit)
```
我们现在还有一些静态实用方法：

```java
Executor delayedExecutor(long delay, TimeUnit unit, Executor executor)
Executor delayedExecutor(long delay, TimeUnit unit)
<U> CompletionStage<U> completedStage(U value)
<U> CompletionStage<U> failedStage(Throwable ex)
<U> CompletableFuture<U> failedFuture(Throwable ex)
最后，为了解决超时问题，Java 9引入了两个新函数：

orTimeout()
completeOnTimeout()
```

这里是进一步阅读的详细文章：Java 9 CompletableFuture API改进。

##. 结论
在这篇文章中，我们描述了CompletableFuture类的方法和典型用例。
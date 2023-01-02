---
title:  Runnable, Callable and Future
date: '2022-12-27'
spoiler: Runnable, Callable and Future in Java. 他们之间什么关系？如何更好的理解 Java 的 Future
---

## Runnable

Java 的官方定义是这样说的

> The Runnable interface should be implemented by any class whose instances are intended to be executed by a thread. The class must define a method of no arguments called run.

能被一个线程执行，没有任何返回值

## Callable

Java 的官方定义是这样的

> The Callable interface is similar to Runnable, in that both are designed for classes whose instances are potentially executed by another thread. A Runnable, however, does not return a result and cannot throw a checked exception.

和 Runnable 类似，能被一个线程执行。区别是 Callable 有返回值，并且可能在获取结果时抛出异常。

Callable 会有返回值，当 Callable 这个线程结束的时候，需要有一个地方能存这个结果，这样我的主线程才能获取这个将来的值。 这个能存储这个结果的东西，就叫 Future

## Future

Future 的定义是这样的

> A Future represents the result of an asynchronous computation. Methods are provided to check if the computation is complete, to wait for its completion, and to retrieve the result of the computation. 

Future  代表的是一个异步计算的结果。 main 主线程通过 Future 来追踪异步线程和获取结果


## Code Sample

```java
import java.util.concurrent.Callable;  
  
public class CallableExample implements Callable<Integer> {  
  
    @Override  
    public Integer call() throws Exception {  
  
        Thread.sleep(2000);  
  
        return 5;  
    }  
}

# code samples,
public static void main(String[] args) throws InterruptedException {  
  
    CallableExample callableExample = new CallableExample();  
  
    ExecutorService executorService = Executors.newSingleThreadExecutor();  
    Future<Integer> result = executorService.submit(callableExample);  
  
    try {  
        System.out.println(result.get());  
    } catch (ExecutionException e) {  
        throw new RuntimeException(e);  
    }  
}


```


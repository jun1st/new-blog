---
title: 'Common Getter Setter Mistakes In Java'
date: '2021-03-19'
spoiler:  Java 中写 Getter/Setter 容易犯的几个错误
---

##  Getter/Setter  

在 Java 中，Getter/Setter 是最常用的两个用来获取和更新一个 Class 内部状态的方法。 有了 Getter/Setter 就可以在一定程度上限制调用方。 比如：

```java
public void setNumber(int num) {
    if (num < 10 || num > 100) {
        throw new IllegalArgumentException();
    }
    this.number = num;
}
```

但是，如果无脑写了 Getter/Setter 就会带来很多隐藏问题。


## 给 Public 的变量写 Getter/Setter

比如：

```java

public String firstName;

public void setFirstname(String fname) {
    this.firstName = fname;
}

public String getFirstName() {
    return this.firstName;
}

```
这两个方法毫无意义

## 在 Setter 中直接传递引用

如果在 Setter 中传递一个引用类型，那会带来隐藏的副作用。

 ```java
 private int[] scores;

 public void setScore(int[] src) {
     this.scores = src;
 }
 ```

 这里的问题是，无论 scores 还是外部传递进来的 src 被修改了，都会影响双方。 因为引用指向的是同一份数据。

 如何解决这种引用传递的问题？ 就是在赋值的时候复制一份内容。

 ```java

    public void setStore(int[] src) {
        this.scores = new int[src.length]
        System.arraycopy(src, 0, this.score, 0, src.length);
    }

 ```


 ## 在 Getter 中直接返回内部对象的

 ```java
    private int[] scores;

    public int[] getScores() {
        return this.scores;
    }
 ```

 这么直接返回的的问题，就和前面在 Setter 中直接赋值一样，内外相互影响。 因为这么返回/赋值，实际上你改变了这个 scores 实例的 accessibility。 解决方法也一样，复制一份再返回。

 ```java
    public int[] getScores() {
        int[] copy = new int[this.scores.length];
        System.arraycopy(this.scores, 0, copy, 0, copy.length);
        return copy;
    }
 ```

 ## 给原始类型和 String 提供 Getter 和 Setter 

 原始类型（int, float, double, boolean, char) 和 String 类型，可以放心的实现 getter 和 setter，


 ## Make defensive copies when needed

 这句话是 Joshua Bloch 在他著名的 Effective Java 中提到的。

 ```java
    private Date birthDate;

    public Date getBirthDate() {
        return (Date)this.birthDate.clone();
    }
 ```

 clone() 方法返回一个 Object 对象，因此需要做类型转换。

 ```java

    private List<Person> persons;

    public List<Person> getPersons() [
        return (List<Person>)this.persons.clone();
    ]
```

这里即使返回了一个 clone 的list，但是 list 里包含的对象，还是指向原来的 person instance， 为何？ 因为 List/ArrayList 的 clone() 方法是一个浅 copy， shallow copy。

怎么办， 自己实现 full copy。

## 总结

getter setter 写起来简单，但是如果你不思考，写出了 bug 的话，通常会很难发现
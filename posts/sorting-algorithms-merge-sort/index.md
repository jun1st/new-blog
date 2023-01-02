---
title: '排序算法之合并排序'
date: '2019-01-31'
spoiler: 排序算法之合并排序
---

# 排序算法之合并排序

假如你有一堆卡片，每张卡片上都有个数字。你要按照数字从小到大给卡片顺序。

合并排序的思想如下：

1.  如果总共只有一张卡片，那就他就是排好的
1.  将所有卡片分成数量相等的两部分。把这两部分，继续按照 1，2 步的思想进行操作
1.  等所有拆分的部分都排好序之后，从头到尾遍历这两部分卡片，并按照“拉链闭合”的原理将这两部分合并为完全排好序的一碟卡片

Java 代码实现

```java
public static void merge(int[] arrayOne, int aLeft, int aRight,
                         int[] arrayTwo, int bLeft, int bRight,
                         int[] result) {
    int i = aLeft, j = bLeft;

    for(int k = 0; k <= aRight - aLeft + bRight - bLeft + 1; k++) {
        if (i > aRight) { //第一个数组没有元素了
            result[k] = arrayTwo[j++];
            continue;
        }
        if (j > bRight) { //第二个数组没有元素了
            result[k] = arrayOne[i++];
            continue;
        }
        // 把小的先插入到结果数组中
        result[k] = (arrayOne[i] < arrayTwo[j]) ? arrayOne[i++] : arrayTwo[j++];
    }
}

public static void mergeSort(int[] A, int al, int ar) {
    if (ar > al) {
        int middle = (ar + al) / 2;
        mergeSort(A, al, middle);
        mergeSort(A, middle+1, ar);

        int[] B = new int[ar - al + 1];

        merge(A, al, middle, A, middle + 1, ar, B);

        for(int i=0; i < ar - al + 1; i++) {
            A[al + i] = B[i];
        }

        System.out.println(A);
    }
}
```

merge 函数就是把两个排好序的数组，按照从小到大的顺序插入到一个新的数组中。
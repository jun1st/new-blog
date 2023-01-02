---
title: 'New Features of JavaScript in 2019'
date: '2019-05-15'
spoiler: 2019年，你应该使用的 JavaScript 新特性
---

## async / await

如果你依然深陷回调地狱，那么你依然写着 2014 年的古董代码。除非你别无选择，否则就不要使用回调了。Promise 还可以，但是 async / await 才是你的正确选择。

```jsx
async function getDate() {
  const result = await axios.get("https://dube.io/service/ping");
  const data = result.data;
  console.log("data", data);
  return data;
}
getData();
```

## 解构赋值和默认值（Destructuring & default values）

```jsx
const result = await axios.get("https://your-api-url");
const data = result.data;
```

有一种更简便的做法，那就是解构赋值

```
	const { data } = await.get('https://your-api-url')
```

还可以把变量重命名和给出默认值

```jsx
	const { data: newData } = await.get(...)
	const { id: 1 } = {}
	console.log(id) // 1
```

解构赋值同样适用于函数参数的情况：

```jsx
function calculate({ operands = [1, 2], type = "addition" } = {}) {
  return operands.reduce(
    (acc, val) => {
      switch (type) {
        case "addition":
          return acc + val;
        case "subtraction":
          return acc - val;
        case "multiplication":
          return acc * val;
        case "division":
          return acc / val;
      }
    },
    ["addition", "subtraction"].includes(type) ? 0 : 1
  );
}

console.log(calculate()); // 3
console.log(calculate({ type: "division" })); // 0.5
console.log(calculate({ operands: [2, 3, 4], type: "multiplication" })); // 24
```

## Truthy & false values

**假值**

    	* 长度为 0 的字符串
    	* 数字 0
    	* false
    	* undefined
    	* null
    	* NaN

**真值**

    	* 空数组
    	* 空对象
    	* 所有其他的东西

## Optional chaining

要访问嵌套对象的属性，但是不确定嵌套对象是否有值？

```jsx
let data;
if (obj && obj.firstProp && obj.firstProp.nextProp) {
  data = obj.firstProp.nextProp.data;
}
```

又臭又长？

现在有一种更好的方式了，叫做可选链式调用（optional chaining）

```
	const data = obj?.firstProp?.nextProp?.data
```

好多别的语言都支持类似的语法，比如 Ruby。

PS: 目前可选链式调用 (optional chaining) 还不是官方规范的一部分，是处于 stage-1 的实验性特性。你需要在你的 balelrc 中添加插件 @babel/plugin-proposal-optional-chaining 来使用。

## Use parcel

在 2018 年，browserify，webpack 是主流的 JavaScript 配置打包工具，现在很可能依然是。但是现在很可能有一个更好的选择，

[Parcel](https://parceljs.org/)
[Parcel](https://parceljs.org/)
[Parcel](https://parceljs.org/)

（重要的事情说三遍）

## Write more code, more
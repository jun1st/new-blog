---
title: 'Configure TypeScript, ESLint, Prettier on VSCode to Develop React Native'
date: '2019-11-01'
spoiler: I used TypeScript to develop my latest React Native project. And it’s been a joyful journey. Type system brings more    benefits than expected. It took me sometime to configure VS Code to lint and format TypeScript codes properly. So I’d like to share my configuration, and hope it can be helpful to others。
---

I used TypeScript to develop my latest React Native project. And it’s been a joyful journey. Type system brings more benefits than expected.
It took me sometime to configure VS Code to lint and format TypeScript codes properly. So I’d like to share my configuration, and hope it can be helpful to others.

## Types for React and React

```bash
yarn add -D @types/react @types/react-native
```

add type system for react and react native

## Configure tsconfig.json

```bash
$ tsc --init --pretty --target es5 --allowJs --checkJs --jsx react-native --allowSyntheticDefaultImports
```

配置文件如下

```jsx
{
  "compilerOptions": {
    /* Basic Options */
    "target": "es5",
    "module": "commonjs",
    "allowJs": true,
    "checkJs": true,
    "jsx": "react-native",
    "strict": true,
    "allowSyntheticDefaultImports": true,
    "esModuleInterop": true
  }
}
```

## Enable ESLint inside VS Code

Search “ESLint” inside extensions, the first one should be the one you need to install.

![ESLint](https://miro.medium.com/max/4168/1*LSb-HI5UPbHvZV9xn5ab3Q.png)

## Configure ESLint

Create a file with name .eslintrc.js , which is the file you configure how eslint works.

here is my one:

```jsx
module.exports = {
  env: {
    // 指定脚本的运行环境。每种环境都有一组特定的预定义全局变量
    es6: true,
    node: true,
    jest: true,
    "react-native/react-native": true
  },
  extends: [
    // 一个配置文件可以从基础配置中继承已启用的规则
    "airbnb",
    "plugin:react-native/all",
    "plugin:@typescript-eslint/recommended",
    "prettier",
    "plugin:prettier/recommended",
    "prettier/react",
    "prettier/@typescript-eslint"
  ],
  parser: "@typescript-eslint/parser", // 解析器
  parserOptions: {
    // 解析器选项
    ecmaFeatures: {
      jsx: true,
      impliedStrict: true
    },
    ecmaVersion: 2018,
    sourceType: "module"
  },
  plugins: [
    // ESLint 支持使用第三方插件。在使用插件之前，你必须使用 npm 安装它。
    "react",
    "react-native"
  ],
  settings: {
    // ESLint 支持在配置文件添加共享设置
    "import/resolver": {
      typescript: {},
      "babel-plugin-root-import": {
        rootPathSuffix: "app",
        rootPathPrefix: "~"
      },
      node: {
        extensions: [".js", ".jsx", "ts", ".tsx"]
      }
    }
  },
  globals: {
    ios: false,
    android: false,
    windowHeight: false,
    windowWidth: false,
    hairlineWidth: false,
    DeviceInfo: false,
    isIphoneX: false,
    StatusBarHeight: false,
    HeaderHeight: false
  },
  rules: {
    // 启用的规则及其各自的错误级别
    "global-require": 0,
    "linebreak-style": [2, "unix"],
    "prefer-const": 0,
    "no-console": [
      "warn",
      {
        allow: ["warn", "error", "log", "info", "disableYellowBox"]
      }
    ],
    "no-param-reassign": ["error", { props: false }],
    "no-restricted-globals": 0,
    "no-unused-vars": 0,
    "no-use-before-define": 0,
    "no-underscore-dangle": 0,
    "no-useless-constructor": 0,
    "no-unused-expressions": 0,
    "no-plusplus": 0,
    "no-nested-ternary": 0,
    "lines-between-class-members": [
      1,
      "always",
      {
        exceptAfterSingleLine: true
      }
    ],
    "prefer-destructuring": [
      2,
      {
        array: false,
        object: true
      }
    ],
    "max-classes-per-file": 0,
    "import/prefer-default-export": 0,
    "react/prefer-stateless-function": 0,
    "react/destructuring-assignment": 0,
    "react/prop-types": 0,
    "react/react-in-jsx-scope": 0,
    "react/jsx-props-no-spreading": 0,
    "react/jsx-filename-extension": [
      2,
      {
        extensions: [".jsx", ".tsx"]
      }
    ],
    "jsx-a11y/accessible-emoji": 0,
    "react/static-property-placement": 0,
    "react-native/no-color-literals": 0,
    "react-native/no-raw-text": 0,
    "react-native/no-inline-styles": 0,
    "react-native/split-platform-components": 0,
    "@typescript-eslint/explicit-member-accessibility": [
      2,
      { accessibility: "no-public" }
    ],
    "@typescript-eslint/no-empty-interface": 1,
    "@typescript-eslint/explicit-function-return-type": [
      0,
      {
        allowExpressions: true,
        allowTypedFunctionExpressions: true
      }
    ],
    "@typescript-eslint/no-explicit-any": 0,
    "@typescript-eslint/no-use-before-define": [
      2,
      {
        functions: true,
        classes: true,
        variables: false
      }
    ],
    "@typescript-eslint/no-unused-vars": [1, { args: "none" }],
    "@typescript-eslint/no-non-null-assertion": 0,
    "@typescript-eslint/camelcase": 0,
    "@typescript-eslint/ban-ts-ignore": 0
  }
};
```

## Configure your Project

For ESLint to work properly with VSCode, there are some npm packages to be installed as dev dependencies.

```bash
$ yarn add -D eslint eslint-config-airbnb eslint-plugin-jsx-a11y eslint-plugin-import eslint-plugin-react eslint-plugin-react-native @typescript-eslint/parser @typescript-eslint/eslint-plugin eslint-import-resolver-typescript
```

- eslint: javascript and jsc checking tool
- eslint-config-airbnb: provide .eslintrc as an extension
- eslint-plugin-jsx-a11y: AST checking for jsx elements
- eslint-plugin-import: support linting ES2015 + (ES6+) import/export
- eslint-plugin-react: lint react
- eslint-plugin-react-native: lint react native
- @typescript-eslint/parser: convert TypeScript to ESTree, for eslint to lint
- @typescript-eslint/eslint-plugin: some TypeScript rules for eslint to lint

## Use Prettier to Format Codes

ESLint helps to validate your codes, but you still needs to fix issues found by ESLint. Besides, code format is extremely import for languages like JavaScript and TypeScript

### Install VSCode Plugin

![Prettier](https://miro.medium.com/max/4792/1*qO1lUA8WbyGVaNq8g7Od5Q.png)

### Configure Prettier

search prettier in Setting,

![configure prettier](https://miro.medium.com/max/3984/1*s648RfUSW5E3tCWbshW2EA.png)

choose settings that fits you.

## Integrate ESLint and Prettier

Last yet most import, you needs to configure prettier and eslint to work together.

```bash
yarn add prettier eslint-config-prettier eslint-plugin-prettier -D
```

- prettier: well, prettier it is
- eslint-config-prettier: turn off all rules from eslint that may conflict with prettier
- eslint-plugin-prettier: run prettier as plugin of eslint

## Configuration

Setting is inside .eslintrc.js file

![Setting](https://miro.medium.com/max/1880/1*Yrf0PANvsBYzAMEMkW8jkQ.png)

That’s all.

There’re still many tweaks need to be done to make ESLint and Prettier work for you. But they are working now.

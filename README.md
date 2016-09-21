# maptalks demos

[![Circle CI](https://circleci.com/gh/maptalks/maptalks-demo.svg?style=shield)](https://circleci.com/gh/maptalks/maptalks-demo)

Demos of [maptalks.js](https://github.com/maptalks/maptalks.js)

## 目录说明
```
.
|- assets 全局资源文件, 页面css/图片及maptalks.js
|- build  脚本程序, 例如自动页面错误检测
|- dist   生成目录, 编译好的demo页面都会生成在这里, 也是connect http服务的根目录
|- examples 源代码, examples.json是所有demo的索引文件
|- layouts  模板文件
```

## Setup
1. 命令行中进入项目根目录, 运行

  ```bash
  npm install
  ```
2. npm依赖包安装完毕后, 运行

  ```bash
  gulp
  ```
  gulp脚本会自动运行以下任务
  * 将./examples/下的资源文件拷贝到./dist/examples中
  * 编译./examples/下的demo源代码, 在./dist/exmaples中生成编译好的demo页面
  * 在20001端口上启动connect服务, 并监听文件修改, 随时重复自动构建
  
3. 用浏览器打开 [http://localhost:20001/examples/en/list.html](http://localhost:20001/examples/en/list.html)

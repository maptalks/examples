# maptalks examples

[![Circle CI](https://circleci.com/gh/maptalks/examples/tree/master.svg?style=shield)](https://circleci.com/gh/maptalks/examples/tree/master)

Examples of [maptalks.js](https://github.com/maptalks/maptalks.js)

## 目录说明

```bash
.
|- assets/              全局资源文件, 页面css/图片
|- build/examples.json  examples的索引文件, gulp根据索引合成页面
|- dist/                生成目录, 编译好的demo页面都会生成在这里, 也是connect http服务的根目录
|- layouts/             模板文件
|- locales/             国际化(i18n)文件
|- src/                 examples的源代码
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

* 将`assets`下的资源文件拷贝到`dist/`中
* 编译`src`下的demo源代码, 在`dist`中生成编译好的demo页面
* 在20001端口上启动connect服务, 并监听文件修改, 随时重复自动构建

3. 用浏览器打开以下地址

* [http://localhost:20001/en/](http://localhost:20001/en/)
* [http://localhost:20001/cn/](http://localhost:20001/cn/)

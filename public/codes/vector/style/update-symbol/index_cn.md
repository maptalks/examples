`updateSymbol` 用于图层样式的局部更新，相比 `setStyle` 性能更高，且除了部分需重构 Mesh 的属性一般不会造成图层刷新闪烁，具体可以参考该[文档](https://doc.maptalks.com/docs/api/vt/vector-perf/)。

[Proj4js](http://proj4js.org) 是地理坐标参考系的转换javascript库, 它同时支持不同大地基准面的转换.

maptalks能和proj4js一同工作, 载入不同空间参考系的地图数据.

你所需的只是用proj4js定义一个projection对象, 并设置给地图对象的spatialReference(空间参考)属性.

以下的例子用proj4js来实现了默认的EPSG:3857空间参考.

瓦片BASE64编码载入的示例, 很适合用于移动端中加载离线地图瓦片.

预先将瓦片数据存入sqlite数据库, 然后按照示例中所示:
* 重写TileLayer的getTileUrl方法, 根据x,y,z返回sqlite的连接字
* 重写TileLayer renderer的getTileImage方法, 用sqlite连接字查询数据库, 返回base64后, 设置给image.src

> 瓦片存储有一种专门格式, [mbtiles格式](https://github.com/mapbox/mbtiles-spec), 可以作为在移动端存储瓦片的参考格式

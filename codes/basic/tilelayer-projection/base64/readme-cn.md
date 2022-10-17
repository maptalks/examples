瓦片 BASE64 编码载入的示例, 很适合用于移动端中加载离线地图瓦片.

预先将瓦片数据存入 sqlite 数据库, 然后按照示例中所示:

- 重写 TileLayer 的 getTileUrl 方法, 根据 x,y,z 返回 sqlite 的连接字
- 重写 TileLayer renderer 的 getTileImage 方法, 用 sqlite 连接字查询数据库, 返回 base64 后, 设置给 image.src

> 瓦片存储有一种专门格式, [mbtiles 格式](https://github.com/mapbox/mbtiles-spec), 可以作为在移动端存储瓦片的参考格式

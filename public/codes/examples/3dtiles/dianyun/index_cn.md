#### Geo3DTilesLayer 的属性说明如下

| 属性   | 说明              | 类型    | 默认值          |
| ------ | ----------------- | ------- | --------------- |
| maxCacheSize | 缓存的最大瓦片数 | Number |            |
| services  | 倾斜模型服务的数组对象      | Object  |             |
| loadingLimit  | 瓦片请求最大限制数量      | Number  |    0         |

#### Geo3DTilesLayer.services 的属性说明如下
| 属性   | 说明              | 类型    | 默认值          |
| ------ | ----------------- | ------- | --------------- |
| url | 服务地址 | String |            |
| maximumScreenSpaceError  | 最大屏幕空间误差,清晰度可以接受的情况下，推荐把这个值设得越大越好，性能会越好      | Number  |             |
| heightOffset  | 高度偏移量      | Number  |    0         |
| ambientLight  | 环境光      | Array  |    [1, 1, 1]        |

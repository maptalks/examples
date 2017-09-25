TileLayer有两个renderer: `canvas` 和 `gl`(默认), 浏览器不支持webgl时(IE9/10), 会自动切换为`canvas`

它们的不同点如下, 请根据实际情况选用不同的renderer:

| renderer | 支持IE9/10 | 支持三维 | 必须允许[跨域](https://developer.mozilla.org/zh-CN/docs/Web/HTTP/Access_control_CORS) |
| ------| ------ | ------ | ------ |
| gl | 否 | 是 | 是 |
| canvas | 是 | 否 | 否* |


\* 但在调用map.toDataURL导出图片时, 瓦片必须支持跨域, 且TileLayer必须设置crossOrigin

TileLayer 有两个 renderer: `canvas` 和 `gl`(默认), 浏览器不支持 webgl 时(IE9/10), 会自动切换为`canvas`

它们的不同点如下, 请根据实际情况选用不同的 renderer:

| renderer | 支持 IE9/10 | 支持三维 | 必须允许[跨域](https://developer.mozilla.org/zh-CN/docs/Web/HTTP/Access_control_CORS) |
| -------- | ----------- | -------- | ------------------------------------------------------------------------------------- |
| gl       | 否          | 是       | 是                                                                                    |
| canvas   | 是          | 否       | 否\*                                                                                  |

\* 但在调用 map.toDataURL 导出图片时, 瓦片必须支持跨域, 且 TileLayer 必须设置 crossOrigin

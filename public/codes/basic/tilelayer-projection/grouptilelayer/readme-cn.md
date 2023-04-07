GroupTileLayer 用于同时添加一组 TileLayer, 其性能比分别添加同样的 TileLayer 要更高, 另外可以避免 TileLayer 过多时, 浏览器会因为 webgl context 数量过多, 而显示警告:

`WARNING: Too many active WebGL contexts. Oldest context will be lost`

GroupTileLayer用于同时添加一组TileLayer, 其性能比分别添加同样的TileLayer要更高, 另外可以避免TileLayer过多时, 浏览器会因为webgl context数量过多, 而显示警告:

`WARNING: Too many active WebGL contexts. Oldest context will be lost`

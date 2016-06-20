var map = new maptalks.Map("map", {
  center: [121.48542888885189, 31.228541533313702],
  zoom: 14,
  baseLayer: new maptalks.TileLayer("tile", {
    urlTemplate: 'http://map.geoq.cn/ArcGIS/rest/services/ChinaOnlineStreetPurplishBlue/MapServer/tile/{z}/{y}/{x}',
    subdomains: [1, 2, 3, 4]
  })
});

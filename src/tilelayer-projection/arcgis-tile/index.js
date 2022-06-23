var arcUrl = 'http://cache1.arcgisonline.cn/arcgis/rest/services/ChinaOnlineCommunity/MapServer';

maptalks.SpatialReference.loadArcgis(arcUrl + '?f=pjson', function (err, conf) {
  if (err) {
    throw new Error(err);
  }
  var ref = conf.spatialReference;
  ref.projection = 'EPSG:4326';

  var map = new maptalks.Map('map', {
    center: [121, 0],
    zoom: 1,
    minZoom: 1,
    maxZoom : 16,
    spatialReference : ref,
    baseLayer: new maptalks.TileLayer('base', {
      'tileSystem' : conf.tileSystem,
      'tileSize' : conf.tileSize, // [512, 512]
      'urlTemplate' : arcUrl + '/tile/{z}/{y}/{x}',
      'attribution' : '&copy; <a target="_blank" href="' + arcUrl + '"">ArcGIS</a>'
    })
  });
});


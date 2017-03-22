var arcUrl = 'https://services.arcgisonline.com/arcgis/rest/services/ESRI_Imagery_World_2D/MapServer';

maptalks.View.loadArcgis(arcUrl + '?f=pjson', function (err, conf) {
  if (err) {
    throw new Error(err);
  }
  var view = conf.view;
  view.projection = 'EPSG:4326';

  var map = new maptalks.Map('map', {
    center: [121, 0],
    zoom: 0,
    maxZoom : 16,
    view : view,
    baseLayer: new maptalks.TileLayer('base', {
      'tileSystem' : conf.tileSystem,
      'tileSize' : conf.tileSize, // 512, 512
      'urlTemplate' : arcUrl + '/tile/{z}/{y}/{x}'
    }),
    attribution : {
      content : '&copy; <a target="_blank" href="' + arcUrl + '"">ArcGIS</a>'
    }
  });
});


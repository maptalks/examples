
var map = new maptalks.Map('map', {
  center: [121.48542888885189, 31.228541533313702],
  zoom: 14,
  baseLayer: new maptalks.TileLayer('base', {
    urlTemplate: '$(urlTemplate)',
    subdomains: $(subdomains)
  })
});

var layer = new maptalks.VectorLayer('vector');
map.addLayer(layer);

var rect = new maptalks.Rectangle([121.485428, 31.228541], 1000, 800, {
  symbol:{
    'lineColor' : '#6fa8dc',
    'polygonPatternFile' : 'marker.png',
    'polygonOpacity' : 1
  }
});
layer.addGeometry(rect);

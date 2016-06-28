
var map = new maptalks.Map('map', {
  center: [121.48542888885189, 31.228541533313702],
  zoom: 14,
  baseLayer: new maptalks.TileLayer('tile', {
    urlTemplate: '$(urlTemplate)',
    subdomains: $(subdomains)
  })
});

var layer = new maptalks.VectorLayer('vector');
map.addLayer(layer);
var symbol = {
    'markerType': 'ellipse',
    'markerFill': '#6fa8dc',
    'markerFillOpacity': 1,
    'markerLineColor': '#f9cb9c',
    'markerLineWidth': 1,
    'markerLineOpacity': 1,
    'markerWidth': 30,
    'markerHeight': 30,
    'markerDx': 0,
    'markerDy': 0
 };
var geometry = new maptalks.Marker([121.485428, 31.228541], {'symbol' : symbol});
layer.addGeometry(geometry);

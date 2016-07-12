
var map = new maptalks.Map('map', {
  center: [121.48542888885189, 31.228541533313702],
  zoom: 14,
  baseLayer: new maptalks.TileLayer('base', {
    urlTemplate: '$(urlTemplate)',
    subdomains: $(subdomains)
  })
});



var extent = map.getExtent(),
    min = extent.getMin(),
    w = extent.getWidth(),
    h = extent.getHeight(),
    markers = [];
for (var i = 0; i < 100; i++) {
  markers.push(new maptalks.Marker([min.x + Math.random() * w, min.y + Math.random() * h]));
}

var layer = new maptalks.VectorLayer('vector')
    .addGeometry(markers)
    .addTo(map);

map.on('mousemove', function (param) {
  if (!layer.getMask()) {
    layer.setMask(new maptalks.Marker(param.coordinate, {
      'symbol': {
        'markerType': 'square',
        'markerWidth': 200,
        'markerHeight': 200,
        'markerLineWidth' : 3,
        'markerLineColor' : '#34495e',
        'markerLineOpacity' : 0.8,
        'markerFillOpacity' : 0
      }
    }));
  } else {
    layer.getMask().setCoordinates(param.coordinate);
  }
})

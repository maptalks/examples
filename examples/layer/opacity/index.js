
var map = new maptalks.Map('map', {
  center: [121.48542888885189, 31.228541533313702],
  zoom: 14,
  baseLayer: new maptalks.TileLayer('base', {
    urlTemplate: '$(urlTemplate)',
    subdomains: $(subdomains)
  })
});

var polygon1 = new maptalks.Polygon([
  [
    [121.478542, 31.239812],
    [121.478437, 31.226512],
    [121.464322, 31.221053]
  ]
], {
  'symbol': {
    'lineColor': 'orange',
    'lineWidth': 3,
    'polygonFill': '#ccc',
    'polygonOpacity': 1.0
  }
});

var layer1 = new maptalks.VectorLayer('vector1', {
  opacity: 0.5
}).addGeometry(polygon1).addTo(map);

var polygon2 = new maptalks.Polygon([
  [
    [121.489542, 31.239812],
    [121.489437, 31.226512],
    [121.502322, 31.221053]
  ]
], {
  'symbol': {
    'lineColor': 'orange',
    'lineWidth': 3,
    'polygonFill': '#ccc',
    'polygonOpacity': 1.0
  }
});

var layer2 = new maptalks.VectorLayer('vector2', {
  opacity: 0.8
}).addGeometry(polygon2).addTo(map);

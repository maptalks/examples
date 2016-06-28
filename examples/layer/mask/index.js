
var map = new maptalks.Map('map', {
  center: [121.48542888885189, 31.228541533313702],
  zoom: 14,
  baseLayer: new maptalks.TileLayer('base', {
    urlTemplate: '$(urlTemplate)',
    subdomains: $(subdomains)
  })
});

var mask = new maptalks.Marker([121.481542, 31.230812], {
  'symbol': {
    'markerType': 'ellipse',
    'markerWidth': 180,
    'markerHeight': 200,
    'markerFill': '#ecb',
    'markerFillOpacity': 1
  }
});

var polygon = new maptalks.Polygon([
  [
    [121.487542, 31.239812],
    [121.487437, 31.226512],
    [121.473322, 31.221053]
  ]
], {
  'symbol': {
    'lineColor': '#ff0000',
    'lineWidth': 8,
    'polygonFill': '#0000ff'
  }
});

var layer = new maptalks.VectorLayer('vector')
    .addGeometry(polygon)
    .setMask(mask)
    .addTo(map);

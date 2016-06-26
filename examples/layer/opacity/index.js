
var map = new maptalks.Map('map', {
  center: [121.48542888885189, 31.228541533313702],
  zoom: 14,
  baseLayer: new maptalks.TileLayer('base', {
    urlTemplate: '$(urlTemplate)',
    subdomains: $(subdomains)
  })
});

var polygon = new maptalks.Polygon([
  [
    [121.487542, 31.239812],
    [121.487437, 31.226512],
    [121.473322, 31.221053]
  ]
], {
  'symbol': {
    'lineColor': '#00ff00',
    'lineWidth': 3,
    'polygonFill': '#ff0000'
  }
});

var layer = new maptalks.VectorLayer('vector')
  .addGeometry(polygon)
  .addTo(map);

$('#slider').slider({
  orientation: 'vertical',
  min: 0.0,
  max: 1.0,
  step: 0.01,
  value: 1.0,
  change: function (event, ui) {
    layer.config({
      opacity: ui.value
    });
  }
});

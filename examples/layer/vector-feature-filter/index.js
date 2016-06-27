
var map = new maptalks.Map('map', {
  center: [121.48542888885189, 31.228541533313702],
  zoom: 14,
  baseLayer: new maptalks.TileLayer('base', {
    urlTemplate: '$(urlTemplate)',
    subdomains: $(subdomains)
  })
});

var layer = new maptalks.VectorLayer('vector')
    .addTo(map);

['#0000ff', '#ff0000', '#00ff00'].forEach(function (color, idx) {
  var id = idx + 1;
  new maptalks.Polygon([
    [121.455542 + 0.02 * idx, 31.238812],
    [121.468542 + 0.02 * idx, 31.238812],
    [121.468542 + 0.02 * idx, 31.223812],
    [121.455542 + 0.02 * idx, 31.223812]
  ], {
    'properties': {
      'id': id,
      'name': 'polygon' + id
    },
    'symbol': {
      'lineColor': color,
      'lineWidth': (idx + 1) * 2
    }
  }).addTo(layer);
});

document.getElementById('filter').onclick = function () {
  var features = layer.filter([
    'any',
    ['==', 'id', 1],
    ['==', 'name', 'polygon3']
  ]);

  console.log(features);
};


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
    [121.475542, 31.238812],
    [121.488542, 31.238812],
    [121.488542, 31.223812],
    [121.475542, 31.223812]
  ]
], {
  'symbol': {
    'lineColor': '#00ff00',
    'lineWidth': 8,
    'polygonFill': '#ff0000'
  }
});

var layer1 = new maptalks.VectorLayer('vector-1')
    .addGeometry(polygon1)
    .addTo(map);

var polygon2 = new maptalks.Polygon([
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

var layer2 = new maptalks.VectorLayer('vector-2')
    .addGeometry(polygon2)
    .addTo(map);

document.querySelector('#front').addEventListener('click', function () {
  layer1.bringToFront();
});

document.querySelector('#back').addEventListener('click', function () {
  layer1.bringToBack();
});

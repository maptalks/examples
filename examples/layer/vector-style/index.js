
var map = new maptalks.Map('map', {
  center: [121.48542888885189, 31.228541533313702],
  zoom: 14,
  baseLayer: new maptalks.TileLayer('base', {
    baseLayerRenderer: 'dom',
    urlTemplate: '$(urlTemplate)',
    subdomains: $(subdomains)
  })
});

var layer = new maptalks.VectorLayer('vector')
    .addTo(map);

var colors = ['#ff0000', '#00ff00', '#0000ff'];

for (var idx = 0; idx < 3; idx++) {
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
    }
  }).addTo(layer);
}

function setStyle() {
  layer.setStyle([
    {
      'filter': [
        'all',
        ['>', 'id', 1],
        ['<', 'id', 3]
      ],
      'symbol': {
        'polygonOpacity': 0.9,
        'lineColor': colors[2],
        'polygonFill': colors[1]
      }
    },
    {
      'filter': ['==', 'id', 1],
      'symbol': {
        'polygonOpacity': 0.9,
        'lineColor': colors[1],
        'polygonFill': colors[0]
      }
    },
    {
      'filter': ['==', 'name', 'polygon3'],
      'symbol': {
        'polygonOpacity': 0.9,
        'lineColor': colors[0],
        'polygonFill': colors[2]
      }
    }
  ]);
}

var toolbar = new maptalks.control.Toolbar({
  items: [
    {
      item: 'Set Style',
      click: setStyle
    }
  ]
}).addTo(map);

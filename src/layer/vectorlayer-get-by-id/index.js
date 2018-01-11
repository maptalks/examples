
var map = new maptalks.Map('map', {
  center: [121.4854, 31.2285],
  zoom: 14,
  attribution: true,
  baseLayer: new maptalks.TileLayer('base', {
    urlTemplate: '$(urlTemplate)',
    subdomains: $(subdomains),
    attribution: '$(attribution)'
  })
});

var layer = new maptalks.VectorLayer('vector')
    .addTo(map);

// get id of 100
function get100() {
  getById(100);
}

// get id of 200
function get200() {
  getById(200);
}

function getById(id) {
  layer.getGeometryById(id).updateSymbol([{ 'polygonFill': '#f00' }]);
}

for (var i = 0; i < 3; i++) {
  new maptalks.Polygon(
    [
      [121.455542 + 0.02 * i, 31.233812],
      [121.468542 + 0.02 * i, 31.233812],
      [121.468542 + 0.02 * i, 31.222812],
      [121.455542 + 0.02 * i, 31.222812]
    ],
    {
      'id' : (i + 1) * 100,
      'properties': {
        'count': (i + 1) * 100
      },
      'symbol': [
        {
          'polygonFill': '#747474',
          'polygonOpacity': 0.5,
          'lineColor': '#000',
          'lineWidth': 2
        },
        {
          'textName' : '{count}',
          'textSize' : 40,
          'textFill' : '#fff'
        }
      ]
    }
  ).addTo(layer);
}

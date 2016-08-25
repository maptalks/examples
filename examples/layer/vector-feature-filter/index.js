
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

for (var i = 0; i < 3; i++) {
  new maptalks.Polygon([
    [121.455542 + 0.02 * i, 31.233812],
    [121.468542 + 0.02 * i, 31.233812],
    [121.468542 + 0.02 * i, 31.222812],
    [121.455542 + 0.02 * i, 31.222812]
  ], {
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
  }).addTo(layer);
}


function doFilter() {
  var features = layer
    .filter(['>=', 'count', 200])
    .forEach(function (feature) {
      feature.setSymbol([
        {
          'polygonFill': 'rgb(216,115,149)',
          'polygonOpacity': 0.5,
          'lineColor': '#000',
          'lineWidth': 2
        },
        {
          'textName' : '{count}',
          'textSize' : 40,
          'textFill' : '#fff'
        }
      ]);
    });
}

var toolbar = new maptalks.control.Toolbar({
  items: [
    {
      item: 'Filter those >= 200',
      click: doFilter
    }
  ]
}).addTo(map);

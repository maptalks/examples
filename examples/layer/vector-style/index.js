
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
    .setStyle({
      'filter' : ['count', '>=', 0],
      'symbol' : getSymbol('#747474')
    })
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
    }
  }).addTo(layer);
}

function setStyle() {
  layer.setStyle([
    {
      'filter': ['==', 'count', 100],
      'symbol': getSymbol('#1bbc9b')
    },
    {
      'filter': ['==', 'count', 200],
      'symbol': getSymbol('rgb(216,115,149)')
    },
    {
      'filter': ['==', 'count', 300],
      'symbol': getSymbol('rgb(135,196,240)')
    }
  ]);
}

function getSymbol(color) {
  return [
    {
      'polygonFill': color,
      'polygonOpacity': 0.5,
      'lineColor': '#000',
      'lineWidth': 2
    },
    {
      'textName' : '{count}',
      'textSize' : 40,
      'textFill' : '#fff'
    }
  ];
}

var toolbar = new maptalks.control.Toolbar({
  items: [
    {
      item: 'Set style to layer',
      click: setStyle
    }
  ]
}).addTo(map);


var map = new maptalks.Map('map', {
  center: [-0.113049,51.498568],
  zoom: 14,
  attribution: {
    content: '$(attribution)'
  },
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

// prepare data
for (var i = 0; i < 3; i++) {
  new maptalks.Polygon([
    [-0.123049 + 0.02 * i, 51.503568],
    [-0.136049 + 0.02 * i, 51.503568],
    [-0.136049 + 0.02 * i, 51.488568],
    [-0.123049 + 0.02 * i, 51.488568]
  ], {
    'properties': {
      'count': (i + 1) * 100
    }
  }).addTo(layer);
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


var map = new maptalks.Map('map', {
  center: [121.4854, 31.2285],
  zoom: 14,
  baseLayer: new maptalks.TileLayer('base', {
    urlTemplate: '$(urlTemplate)',
    subdomains: $(subdomains)
  })
});

var layer = new maptalks.VectorLayer('vector')
    .addTo(map);

function getById(id) {
  layer.getGeometryById(id).updateSymbol([{ 'polygonFill': '#f00' }]);
}

//<<<<<<<< prepare data
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
//>>>>>>>>
var actionBar = new maptalks.control.Toolbar({
  items: [
    {
      item: 'Get ID of 100',
      click: function () {
        getById(100);
      }
    },
    {
      item: 'Get ID of 200',
      click: function () {
        getById(200);
      }
    }
  ]
}).addTo(map);

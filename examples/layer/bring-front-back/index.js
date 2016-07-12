
var map = new maptalks.Map('map', {
  center: [121.48542888885189, 31.228541533313702],
  zoom: 14,
  baseLayer: new maptalks.TileLayer('base', {
    urlTemplate: '$(urlTemplate)',
    subdomains: $(subdomains)
  })
});

var rect2 = new maptalks.Rectangle(
  [121.46281250243517, 31.23050448425938],
  1600,
  1000,
  {
    'symbol': [
      {
        'textName' : 'Layer 2',
        'textWeight' : 'bold',
        'textSize' : 30,
        'textFill' : '#fff'
      },
      {
        'lineColor': '#34495e',
        'lineWidth': 3,
        'polygonFill': '#1bbc9b',
        'polygonOpacity' : 1
      }
    ]
  }
);

var layer2 = new maptalks.VectorLayer('2')
  .addGeometry(rect2)
  .addTo(map);

var rect1 = rect2.copy()
  .translate([0.006, 0.006])
  .updateSymbol([{'textName' : 'Layer 1'}, {'polygonFill' : 'rgb(216,115,149)'}]);

var layer1 = new maptalks.VectorLayer('1')
  .addGeometry(rect1)
  .addTo(map);

var toolbar = new maptalks.control.Toolbar({
  items: [
    {
      item: 'Bring layer 1 to front',
      click: function () {
        layer1.bringToFront();
      }
    },
    {
      item: 'Bring layer 1 to back',
      click: function () {
        layer1.bringToBack();
      }
    }
  ]
}).addTo(map);

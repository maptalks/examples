
var map = new maptalks.Map('map', {
  center: [-0.113049,51.498568],
  zoom: 14,
  baseLayer: new maptalks.TileLayer('base', {
    urlTemplate: '$(urlTemplate)',
    subdomains: $(subdomains)
  })
});

var rect2 = new maptalks.Rectangle(
  [-0.093049,51.508568],
  1600,
  1000,
  {
    'symbol': [
      {
        'lineColor': '#34495e',
        'lineWidth': 3,
        'polygonFill': '#1bbc9b',
        'polygonOpacity' : 1
      },
      {
        'textName' : 'Layer 2',
        'textWeight' : 'bold',
        'textSize' : 30,
        'textFill' : '#fff'
      }
    ]
  }
);

var layer2 = new maptalks.VectorLayer('2')
  .addGeometry(rect2)
  .addTo(map);

var rect1 = rect2.copy()
  .translate([0.006, 0.006])
  .updateSymbol([{'polygonFill' : 'rgb(216,115,149)'}, {'textName' : 'Layer 1'}]);

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

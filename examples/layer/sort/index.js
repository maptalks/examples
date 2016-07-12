
var map = new maptalks.Map('map', {
  center: [121.48542888885189, 31.228541533313702],
  zoom: 14,
  baseLayer: new maptalks.TileLayer('base', {
    urlTemplate: '$(urlTemplate)',
    subdomains: $(subdomains)
  })
});

var rect3 = new maptalks.Rectangle(
  [121.46281250243517, 31.23050448425938],
  1600,
  1000,
  {
    'symbol': [
      {
        'textName' : 'Layer 3',
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

var layer3 = new maptalks.VectorLayer('3')
  .addGeometry(rect3)
  .addTo(map);

var rect2 = rect3.copy()
  .translate([0.006, 0.006])
  .updateSymbol([{'textName' : 'Layer 2'}, {'polygonFill' : 'rgb(216,115,149)'}]);

var layer2 = new maptalks.VectorLayer('2')
  .addGeometry(rect2)
  .addTo(map);

var rect1 = rect2.copy()
  .translate([0.006, 0.006])
  .updateSymbol([{'textName' : 'Layer 1'}, {'polygonFill' : 'rgb(135,196,240)'}]);

var layer1 = new maptalks.VectorLayer('1')
  .addGeometry(rect1)
  .addTo(map);

var toolbar = new maptalks.control.Toolbar({
  items: [
    {
      item: 'Sort to 3, 2, 1',
      click: function () {
        map.sortLayers(['1', '2', '3']);
      }
    },
    {
      item: 'Sort to 1, 2, 3',
      click: function () {
        map.sortLayers(['3', '2', '1']);
      }
    }
  ]
}).addTo(map);

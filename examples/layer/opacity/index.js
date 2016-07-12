
var map = new maptalks.Map('map', {
  center: [121.48542888885189, 31.228541533313702],
  zoom: 14,
  baseLayer: new maptalks.TileLayer('base', {
    urlTemplate: '$(urlTemplate)',
    subdomains: $(subdomains)
  })
});

var rect1 = new maptalks.Rectangle(
  [121.46281250243517, 31.23650448425938],
  1600,
  1000,
  {
    'symbol': [
      {
        'textName' : '70%',
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

var layer1 = new maptalks.VectorLayer('vector1', {
  opacity: 0.7
}).addGeometry(rect1).addTo(map);

var rect2 = rect1.copy().translate([0.03, 0]).updateSymbol([{'textName' : '40%'}]);

var layer2 = new maptalks.VectorLayer('vector2', {
  opacity: 0.4
}).addGeometry(rect2).addTo(map);

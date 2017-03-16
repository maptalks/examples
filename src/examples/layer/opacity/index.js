
var map = new maptalks.Map('map', {
  center: [-0.113049,51.498568],
  zoom: 14,
  baseLayer: new maptalks.TileLayer('base', {
    urlTemplate: '$(urlTemplate)',
    subdomains: $(subdomains)
  })
});

var rect1 = new maptalks.Rectangle(
  [-0.133049,51.508568],
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
        'textName' : '70%',
        'textWeight' : 'bold',
        'textSize' : 30,
        'textFill' : '#fff'
      }
    ]
  }
);

var layer1 = new maptalks.VectorLayer('vector1', {
  'opacity': 0.7
}).addGeometry(rect1).addTo(map);

var rect2 = rect1.copy().translate([0.03, 0]).updateSymbol([{}, { 'textName' : '40%' }]);

var layer2 = new maptalks.VectorLayer('vector2', {
  'opacity' : 0.4
}).addGeometry(rect2).addTo(map);

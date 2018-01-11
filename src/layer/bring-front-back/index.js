var map = new maptalks.Map('map', {
  center: [-0.113049,51.498568],
  zoom: 14,
  baseLayer: new maptalks.TileLayer('base', {
    urlTemplate: '$(urlTemplate)',
    subdomains: $(subdomains),
    attribution: '$(attribution)'
  }),
  layers : [
    new maptalks.VectorLayer('1'),
    new maptalks.VectorLayer('2')
  ]
});

function bringToFront() {
  //bringToFront
  map.getLayer('1').bringToFront();
}

function sendToBack() {
  //bringToBack
  map.getLayer('1').bringToBack();
}

var rect2 = new maptalks.Rectangle(
  map.getCenter().add(-0.02, 0),
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

map.getLayer('2')
  .addGeometry(rect2);

var rect1 = rect2.copy()
  .translate([0.006, 0.006])
  .updateSymbol([{ 'polygonFill' : 'rgb(216,115,149)' }, { 'textName' : 'Layer 1' }]);

map.getLayer('1')
  .addGeometry(rect1);

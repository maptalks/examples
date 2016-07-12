
var map = new maptalks.Map('map', {
  center: [121.48542888885189, 31.228541533313702],
  zoom: 14,
  baseLayer: new maptalks.TileLayer('base', {
    urlTemplate: '$(urlTemplate)',
    subdomains: $(subdomains)
  })
});

var layer = new maptalks.VectorLayer('vector').addTo(map);

var labelNoBox = new maptalks.Label('label without box', [121.472345, 31.226732], {
  'box': false,
  'symbol' : {
    'textWeight' : 'bold',
    'textFaceName' : '"microsoft yahei",arial,sans-serif',
    'textFill' : '#34495e',
    'textSize' : 18,
    'textHaloColor' : '#fff',
    'textHaloRadius' : 3
  }
}).addTo(layer);

var labelWithBox = new maptalks.Label('label with box', [121.489545, 31.226732], {
  'box'          :   true,
  'boxAutoSize'  :   true,
  'boxMinWidth'  :   0,
  'boxMinHeight' :   0,
  'boxPadding'   :   {'width' : 26, 'height' : 8},
  'boxTextAlign' :   'middle', //left, middle, right
  'symbol': {
    'markerLineColor': '#34495e',
    'markerFill' : '#34495e',
    'textFaceName' : '"microsoft yahei",arial,sans-serif',
    'textFill' : '#fff',
    'textSize' : 18
  }
}).addTo(layer);

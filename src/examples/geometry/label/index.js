var c = new maptalks.Coordinate(-0.113049,51.498568);
var map = new maptalks.Map('map', {
  center: c,
  zoom: 14,
  baseLayer: new maptalks.TileLayer('base', {
    urlTemplate: '$(urlTemplate)',
    subdomains: $(subdomains)
  })
});

var label = new maptalks.Label('label without box',
  c.add(-0.013,-0.002),
  {
    'box': false,
    'symbol' : {
      'textWeight' : 'bold',
      'textFaceName' : 'sans-serif',
      'textFill' : '#34495e',
      'textSize' : 18,
      'textHaloColor' : '#fff',
      'textHaloRadius' : 3
    }
  });

var labelBox = new maptalks.Label('label with box',
  c.add(0.004,-0.002),
  {
    'box'          :   true,
    'boxAutoSize'  :   true,
    'boxMinWidth'  :   0,
    'boxMinHeight' :   0,
    'boxPadding'   :   { 'width' : 26, 'height' : 8 },
    'boxTextAlign' :   'middle', //left, middle, right
    'symbol': {
      // box's symbol
      'markerFill' : 'rgb(135,196,240)',
      'markerFillOpacity' : 0.9,
      'markerLineColor' : '34495e',
      'markerLineWidth' : 1,
      // text's symbol
      'textFaceName' : 'monospace',
      'textFill' : '#34495e',
      'textHaloFill' : '#fff',
      'textHaloRadius' : 4,
      'textSize' : 18,
      'textWeight' : 'bold'
    }
  });

new maptalks.VectorLayer('vector', [label, labelBox]).addTo(map);

var map = new maptalks.Map('map', {
  center: [-0.113049,51.498568],
  zoom: 14,
  baseLayer: new maptalks.TileLayer('base', {
    urlTemplate: '$(urlTemplate)',
    subdomains: $(subdomains),
    attribution: '$(attribution)'
  })
});

var label = new maptalks.Label('label without box',
  [-0.126049, 51.496568],
  {
    'draggable' : true,
    'textSymbol': {
      'textFaceName' : 'monospace',
      'textFill' : '#34495e',
      'textHaloFill' : '#fff',
      'textHaloRadius' : 4,
      'textSize' : 18,
      'textWeight' : 'bold',
      'textVerticalAlignment' : 'top'
    }
  });

var labelBox = new maptalks.Label('label with box',
  [-0.109049, 51.496568],
  {
    'draggable' : true,
    'boxStyle' : {
      'padding' : [12, 8],
      'verticalAlignment' : 'top',
      'horizontalAlignment' : 'left',
      'minWidth' : 200,
      'minHeight' : 30,
      'symbol' : {
        'markerType' : 'square',
        'markerFill' : 'rgb(135,196,240)',
        'markerFillOpacity' : 0.9,
        'markerLineColor' : '#34495e',
        'markerLineWidth' : 1
      }
    },
    'textSymbol': {
      'textFaceName' : 'monospace',
      'textFill' : '#34495e',
      'textHaloFill' : '#fff',
      'textHaloRadius' : 4,
      'textSize' : 18,
      'textWeight' : 'bold',
      'textVerticalAlignment' : 'top'
    }
  });

new maptalks.VectorLayer('vector', [labelBox, label]).addTo(map);

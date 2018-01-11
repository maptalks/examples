var map = new maptalks.Map('map', {
  center: [-0.113049,51.498568],
  zoom: 14,
  baseLayer: new maptalks.TileLayer('base', {
    urlTemplate: '$(urlTemplate)',
    subdomains: $(subdomains),
    attribution: '$(attribution)'
  })
});

var areaTool = new maptalks.AreaTool({
  'symbol': {
    'lineColor' : '#1bbc9b',
    'lineWidth' : 2,
    'polygonFill' : '#fff',
    'polygonOpacity' : 0.3
  },
  'vertexSymbol' : {
    'markerType'        : 'ellipse',
    'markerFill'        : '#34495e',
    'markerLineColor'   : '#1bbc9b',
    'markerLineWidth'   : 3,
    'markerWidth'       : 10,
    'markerHeight'      : 10
  },
  'labelOptions' : {
    'textSymbol': {
      'textFaceName': 'monospace',
      'textFill' : '#fff',
      'textLineSpacing': 1,
      'textHorizontalAlignment': 'right',
      'textDx': 15
    },
    'boxStyle' : {
      'padding' : [6, 2],
      'symbol' : {
        'markerType' : 'square',
        'markerFill' : '#000',
        'markerFillOpacity' : 0.9,
        'markerLineColor' : '#b4b3b3'
      }
    }
  },
  'clearButtonSymbol' :[{
    'markerType': 'square',
    'markerFill': '#000',
    'markerLineColor': '#b4b3b3',
    'markerLineWidth': 2,
    'markerWidth': 15,
    'markerHeight': 15,
    'markerDx': 22
  }, {
    'markerType': 'x',
    'markerWidth': 10,
    'markerHeight': 10,
    'markerLineColor' : '#fff',
    'markerDx': 22
  }],
  language: ''
}).addTo(map);

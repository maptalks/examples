var map = new maptalks.Map('map', {
  center: [-0.113049,51.498568],
  zoom: 14,
  attribution: {
    content: '$(attribution)'
  },
  baseLayer: new maptalks.TileLayer('base', {
    urlTemplate: '$(urlTemplate)',
    subdomains: $(subdomains)
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
    'symbol': {
      'textFaceName': 'monospace',
      'textFill' : '#fff',
      'textLineSpacing': 1,
      'textHorizontalAlignment': 'right',
      'textDx': 15,
      'markerLineColor': '#b4b3b3',
      'markerFill' : '#000'
    },
    'boxPadding': {
      'width': 6,
      'height': 4
    }
  },
  'clearButtonSymbol' :[{
    'markerType': 'square',
    'markerFill': '#000',
    'markerLineColor': '#b4b3b3',
    'markerLineWidth': 2,
    'markerWidth': 15,
    'markerHeight': 15,
    'markerDx': 20
  }, {
    'markerType': 'x',
    'markerWidth': 10,
    'markerHeight': 10,
    'markerLineColor' : '#fff',
    'markerDx': 20
  }],
  language: ''
}).addTo(map);

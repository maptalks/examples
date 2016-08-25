
var map = new maptalks.Map('map', {
  center: [121.48542888885189, 31.228541533313702],
  zoom: 14,
  baseLayer: new maptalks.TileLayer('base', {
    urlTemplate: '$(urlTemplate)',
    subdomains: $(subdomains)
  })
});

var distanceTool = new maptalks.DistanceTool({
  'symbol': {
    'lineColor' : '#34495e',
    'lineWidth' : 2
  },
  'vertexSymbol' : {
    'markerType'        : 'ellipse',
    'markerFill'        : '#1bbc9b',
    'markerLineColor'   : '#000',
    'markerLineWidth'   : 3,
    'markerWidth'       : 10,
    'markerHeight'      : 10
  },
  'language' : 'en-US'
}).addTo(map);

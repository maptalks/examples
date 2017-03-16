
var map = new maptalks.Map('map', {
  center: [-0.113049,51.498568],
  zoom: 14,
  baseLayer: new maptalks.TileLayer('base', {
    urlTemplate: '$(urlTemplate)',
    subdomains: $(subdomains)
  })
});
var layer = new maptalks.VectorLayer('v').addTo(map),
  markerLayer = new maptalks.VectorLayer('markers').addTo(map);
var polygon = new maptalks.Polygon([
    [-0.103049, 51.508568],121.48542888885189, 31.22854533313702
    [-0.116049, 51.508568],
    [-0.116049, 51.493568],
    [-0.103049, 51.493568]
], {
  symbol : {
    'lineWidth' : 3,
    'lineColor' : '#223548'
  }
}).addTo(layer);

map.on('click', function (param) {
  var symbol = {
    'markerType'    : 'path',
    'markerPath'    : 'M8 23l0 0 0 0 0 0 0 0 0 0c-4,-5 -8,-10 -8,-14 0,-5 4,-9 8,-9l0 0 0 0c4,0 8,4 8,9 0,4 -4,9 -8,14z M5,9 a3,3 0,1,0,0,-0.9Z',
    'markerPathWidth' : 16,
    'markerPathHeight' : 23,
    'markerWidth'   : 24,
    'markerHeight'  : 34
  };
  symbol.markerFill = '#0e595e';
  if (polygon.containsPoint(param.containerPoint)) {
    symbol.markerFill = 'Red';
  }
  new maptalks.Marker(param.coordinate)
    .setSymbol(symbol)
    .addTo(markerLayer);
});

map.on('contextmenu', function () {
  markerLayer.clear();
});

var toolbar = new maptalks.control.Toolbar({
  items: [
    {
      item: 'Click inside or outside the square',
      click: function () {}
    }
  ]
}).addTo(map);

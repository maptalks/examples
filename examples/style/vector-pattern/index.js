
var map = new maptalks.Map('map', {
  center: [121.48542888885189, 31.228541533313702],
  zoom: 14,
  baseLayer: new maptalks.TileLayer('base', {
    urlTemplate: '$(urlTemplate)',
    subdomains: $(subdomains)
  })
});

var layer = new maptalks.VectorLayer('vector').addTo(map);

var vector = new maptalks.Marker([121.485428, 31.228541], {
  symbol:{
    'markerType' : 'ellipse',
    'markerFillPatternFile' : 'marker.png',
    'markerFillOpacity': 1,
    'markerWidth' : 100,
    'markerHeight' : 100
  }
}).addTo(layer);

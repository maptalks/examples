
var map = new maptalks.Map('map', {
  center: [121.48542888885189, 31.228541533313702],
  zoom: 14,
  baseLayer: new maptalks.TileLayer('base', {
    urlTemplate: '$(urlTemplate)',
    subdomains: $(subdomains)
  })
});

var layer = new maptalks.VectorLayer('vector').addTo(map);

var line = new maptalks.LineString([[121.485428, 31.228541], [121.496428, 31.228541]], {
  symbol:[{
    'lineColor' : '#ffffff',
    'lineWidth' : 3,
    'lineOpacity' : 1
  }, {
    'lineColor' : '#6fa8dc',
    'lineWidth' : 10,
    'lineOpacity' : 1
  }]
}).addTo(layer);

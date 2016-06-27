
var map = new maptalks.Map("map", {
  center: [121.48542888885189, 31.228541533313702],
  zoom: 14,
  scaleControl: {
    'position'  : maptalks.Control['top_left'],
    'maxWidth': 100,
    'metric': true,
    'imperial': true
  },
  baseLayer: new maptalks.TileLayer("base", {
    urlTemplate: '$(urlTemplate)',
    subdomains: $(subdomains)
  })
});

var metric = new maptalks.control.Scale({
    'position'  : maptalks.Control['top_right'],
    'maxWidth': 150,
    'metric': true,
    'imperial': false
});
map.addControl(metric);

var imperial = new maptalks.control.Scale({
    'position'  : maptalks.Control['bottom_right'],
    'maxWidth': 200,
    'metric': false,
    'imperial': true
});
map.addControl(imperial);

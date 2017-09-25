
var map = new maptalks.Map('map', {
  center: [-0.113049,51.498568],
  zoom: 14,
  attribution: {
    content: '$(attribution)'
  },
  scaleControl: {
    'position'  : 'top-left',
    'maxWidth': 100,
    'metric': true,
    'imperial': true
  },
  baseLayer: new maptalks.TileLayer('base', {
    urlTemplate: '$(urlTemplate)',
    subdomains: $(subdomains)
  })
});

var metric = new maptalks.control.Scale({
  'position'  : 'top-right',
  'maxWidth': 150,
  'metric': true,
  'imperial': false
});
map.addControl(metric);

var imperial = new maptalks.control.Scale({
  'position'  : 'bottom-right',
  'maxWidth': 200,
  'metric': false,
  'imperial': true
});
map.addControl(imperial);


var map0 = new maptalks.Map('map', {
  center: [-0.113049,51.498568],
  zoom: 14,
  baseLayer: new maptalks.TileLayer('base', {
    urlTemplate: '$(urlTemplate)',
    subdomains: $(subdomains)
  })
});


var map1 = new maptalks.Map('map1', {
  center: [-0.113049,51.498568],
  zoom: 14,
  draggable : false,
  scrollWheelZoom : false,
  dblClickZoom : false,
  baseLayer: new maptalks.TileLayer('base1', {
    urlTemplate: '$(urlTemplate)',
    subdomains: $(subdomains)
  })
});

map0.on('moving', function (param) {
  map1.setCenter(param.target.getCenter());
});

map0.on('zoomend', function (param) {
  map1.setCenterAndZoom(param.target.getCenter(), param.target.getZoom());
});

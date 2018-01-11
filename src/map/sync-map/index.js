var map0 = new maptalks.Map('map0', {
  center: [-0.113049,51.498568],
  zoom: 14,
  attribution: true,
  zoomControl : true,
  baseLayer: new maptalks.TileLayer('base', {
    urlTemplate: '$(urlTemplate)',
    subdomains: $(subdomains),
    attribution: '$(attribution)'
  })
});


var map1 = new maptalks.Map('map1', {
  center: map0.getCenter(),
  zoom: map0.getZoom(),
  draggable : false,        // disable draggble
  scrollWheelZoom : false,  // disable scroll wheel zoom
  dblClickZoom : false,     // disable doubleclick
  attribution: true,
  baseLayer: new maptalks.TileLayer('base1', {
    urlTemplate: '$(urlTemplate)',
    subdomains: $(subdomains),
    attribution: '$(attribution)'
  })
});

map0.on('moving', function (e) {
  map1.setCenter(e.target.getCenter());
});

map0.on('zoomend', function (e) {
  map1.setCenterAndZoom(e.target.getCenter(), e.target.getZoom());
});

map0.on('pitch', function (e) {
  map1.setPitch(e.target.getPitch());
});

map0.on('rotate', function (e) {
  map1.setBearing(e.target.getBearing());
});

new maptalks.control.Toolbar({
  'position': 'top-right',
  'items': [{
    item: 'move me',
    click: function () {}
  }]
})
.addTo(map0);

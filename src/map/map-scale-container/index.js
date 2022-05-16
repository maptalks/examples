var map = new maptalks.Map('map', {
  center: [-0.113049, 51.498568],
  zoom: 14,
  devicePixelRatio: 2,
  baseLayer: new maptalks.TileLayer('base', {
    urlTemplate: '$(urlTemplate)',
    subdomains: $(subdomains),
    attribution: '$(attribution)'
  })
});

var layer = new maptalks.VectorLayer('layer').addTo(map);
var marker = new maptalks.Marker(map.getCenter());
marker.addTo(layer);

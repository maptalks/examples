
var map = new maptalks.Map('map', {
  center: [-0.113049,51.498568],
  zoom: 14,
  baseLayer: new maptalks.TileLayer('base', {
    urlTemplate: '$(urlTemplate)',
    subdomains: $(subdomains)
  })
});

var layer = new maptalks.VectorLayer('vector').addTo(map),
  layer1 = new maptalks.VectorLayer('vector1').addTo(map),
  marker = new maptalks.Marker([-0.113049,51.498568]).addTo(layer),
  rect = new maptalks.Rectangle([-0.113049,51.488568], 1000, 800).addTo(layer1);

var map1 = new maptalks.Map('map1', {
  center: [-0.113049,51.498568],
  zoom: 14,
  baseLayer: new maptalks.TileLayer('base1', {
    urlTemplate: '$(urlTemplate)',
    subdomains: $(subdomains)
  })
});
maptalks.Layer.fromJSON(layer.toJSON()).addTo(map1);


var map = new maptalks.Map('map', {
  center: [121.48542888885189, 31.228541533313702],
  zoom: 14,
  baseLayer: new maptalks.TileLayer('base', {
    urlTemplate: '$(urlTemplate)',
    subdomains: $(subdomains)
  })
});

var layer = new maptalks.VectorLayer('vector').addTo(map);
var layer1 = new maptalks.VectorLayer('vector1').addTo(map);
var marker = new maptalks.Marker([121.485428, 31.228541]).addTo(layer);
var rect = new maptalks.Rectangle([121.485428, 31.218541], 1000, 800).addTo(layer1);

var map1 = new maptalks.Map('map1', {
  center: [121.48542888885189, 31.228541533313702],
  zoom: 14,
  baseLayer: new maptalks.TileLayer('base1', {
    urlTemplate: '$(urlTemplate)',
    subdomains: $(subdomains)
  })
});
maptalks.Layer.fromJSON(layer.toJSON()).addTo(map1);

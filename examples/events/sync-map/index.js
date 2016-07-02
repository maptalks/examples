
var map = new maptalks.Map('map', {
  center: [121.48542888885189, 31.228541533313702],
  zoom: 14,
  baseLayer: new maptalks.TileLayer('base', {
    urlTemplate: '$(urlTemplate)',
    subdomains: $(subdomains)
  })
});

var layer = new maptalks.VectorLayer('vector').addTo(map);
var marker = new maptalks.Marker([121.485428, 31.228541]).addTo(layer);

var map1 = new maptalks.Map('map1', {
  center: [121.48542888885189, 31.228541533313702],
  zoom: 14,
  baseLayer: new maptalks.TileLayer('base1', {
    urlTemplate: '$(urlTemplate)',
    subdomains: $(subdomains)
  })
});
var layer1 = new maptalks.VectorLayer('vector').addTo(map1);
var marker1 = new maptalks.Marker([121.485428, 31.228541]).addTo(layer1);

map.on('moving', function () {
  map1.setCenter(map.getCenter());
});

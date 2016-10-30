
var map = new maptalks.Map('map', {
  center: [-0.113049,51.498568],
  zoom: 14,
  baseLayer: new maptalks.TileLayer('base', {
    urlTemplate: '$(urlTemplate)',
    subdomains: $(subdomains)
  })
});


var layer = new maptalks.VectorLayer('vector').addTo(map);
var marker = new maptalks.Marker([-0.113049,51.498568]).addTo(layer);
var line = new maptalks.LineString([[-0.113049,51.508568], [-0.103049,51.508568]]).addTo(layer);
var rect = new maptalks.Rectangle([-0.113049,51.488568], 1000, 800).addTo(layer);
var profile = map.toJSON();
document.getElementById('info').innerHTML = JSON.stringify(profile);

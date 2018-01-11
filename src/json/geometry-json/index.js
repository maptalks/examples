var c = [-0.113049,51.498568];
var map = new maptalks.Map('map', {
  center: c,
  zoom: 13,
  attribution: true,
  baseLayer: new maptalks.TileLayer('base', {
    urlTemplate: '$(urlTemplate)',
    subdomains: $(subdomains),
    attribution: '$(attribution)'
  }),
  layers : [
    new maptalks.VectorLayer('v')
  ]
});

var marker = new maptalks.Marker(c);
var rect = new maptalks.Rectangle(c, 1000, 800);
map.getLayer('v').addGeometry(marker, rect);

var map1 = new maptalks.Map('map1', {
  center: c,
  zoom: 13,
  baseLayer: new maptalks.TileLayer('base', {
    urlTemplate: '$(urlTemplate)',
    subdomains: $(subdomains),
    attribution: '$(attribution)'
  })
});
var newLayer = new maptalks.VectorLayer('v').addTo(map1);
// copy geometry by JSON
maptalks.Geometry.fromJSON(rect.toJSON()).addTo(newLayer);
